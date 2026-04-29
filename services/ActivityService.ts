import { supabase } from '@/services/Supabase';
import { ACTIVITY_LIFECYCLE_STATUS_ENUM, TABLE_ENUM } from '@/constants';
import { Activity } from '@/types/activity';
import { resolveSignedAvatarUri } from '@/helpers';

export class ActivityService {
  private async fetchStatusesByActivityIds(activityIds: string[]) {
    if (activityIds.length === 0) return {};

    const { data, error } = await supabase
      .from(TABLE_ENUM.ACTIVITY_STATUSES)
      .select('activity_id, status')
      .in('activity_id', activityIds);

    if (error) {
      console.error('Error fetching activity statuses:', error);
      return {};
    }

    return (data ?? []).reduce<Record<string, ACTIVITY_LIFECYCLE_STATUS_ENUM>>((acc, row) => {
      acc[row.activity_id] = row.status as ACTIVITY_LIFECYCLE_STATUS_ENUM;
      return acc;
    }, {});
  }

  async fetchAllActivities(): Promise<Activity[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from(TABLE_ENUM.ACTIVITIES)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const filtered = data?.filter((row) => row.user_id !== user.id) ?? [];
    const statusByActivityId = await this.fetchStatusesByActivityIds(filtered.map((a) => a.id));

    return Promise.all(
      filtered.map(async (activity) => {
        const resolvedAvatar = await resolveSignedAvatarUri(activity.avatar ?? null);
        return {
          ...activity,
          avatar: resolvedAvatar ?? activity.avatar,
          status: statusByActivityId[activity.id],
        };
      })
    );
  }

  async fetchCurrentUserActivities(): Promise<Activity[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from(TABLE_ENUM.ACTIVITIES)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = data ?? [];
    const statusByActivityId = await this.fetchStatusesByActivityIds(rows.map((a) => a.id));

    return Promise.all(
      rows.map(async (activity) => {
        const resolvedAvatar = await resolveSignedAvatarUri(activity.avatar ?? null);
        return {
          ...activity,
          avatar: resolvedAvatar ?? activity.avatar,
          status: statusByActivityId[activity.id],
        };
      })
    );
  }

  async updateActivityStatus(
    activityId: string,
    status: ACTIVITY_LIFECYCLE_STATUS_ENUM
  ): Promise<boolean> {
    if (!activityId) {
      console.error('No activity id is provided');
      return false;
    }

    const { data: updatedRows, error: updateError } = await supabase
      .from(TABLE_ENUM.ACTIVITY_STATUSES)
      .update({ status })
      .eq('activity_id', activityId)
      .select('activity_id');

    if (updateError) {
      console.error('Error updating activity status:', updateError);
      return false;
    }

    if (!updatedRows || updatedRows.length === 0) {
      const { error: insertError } = await supabase.from(TABLE_ENUM.ACTIVITY_STATUSES).insert({
        activity_id: activityId,
        status,
      });

      if (insertError) {
        console.error('Error inserting initial activity status:', insertError);
        return false;
      }
    }

    return true;
  }
}
