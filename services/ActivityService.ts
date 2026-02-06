import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';
import { Activity } from '@/types/activity';

export class ActivityService {
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

    return data?.filter((data) => data.user_id !== user.id) ?? [];
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
    return data ?? [];
  }
}
