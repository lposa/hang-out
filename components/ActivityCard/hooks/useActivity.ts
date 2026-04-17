import { useEffect, useState } from 'react';
import {
  PARTICIPANT_STATUS_ENUM,
  IPendingActivityParticipant,
} from '@/components/ActivityCard/types';
import { supabase } from '@/services/Supabase';
import { ACTIVITY_LIFECYCLE_STATUS_ENUM, TABLE_ENUM } from '@/constants';
import { useToast } from '@/context/ToastContext';
import { activityService } from '@/services';

export const useActivity = ({
  isCurrentUserActivity,
  activityId,
}: {
  isCurrentUserActivity: boolean;
  activityId: string;
}) => {
  const { showToast } = useToast();

  const [pendingRequests, setPendingRequests] = useState<IPendingActivityParticipant[] | null>(
    null
  );
  const [acceptedParticipants, setAcceptedParticipants] = useState<
    IPendingActivityParticipant[] | null
  >(null);

  const [currentUserParticipationStatus, setCurrentUserParticipationStatus] = useState<
    PARTICIPANT_STATUS_ENUM | 'none'
  >('none');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    loadCurrentUser();
  }, []);

  const handleJoinActivity = async () => {
    if (!currentUserId) {
      showToast('You must be logged in to join activities.', 'error');
      return;
    }

    if (!activityId) {
      showToast('Activity data missing or invalid.', 'error');
      return;
    }

    const { error } = await supabase.from(TABLE_ENUM.ACTIVITY_PARTICIPANTS).insert({
      activity_id: activityId,
      guest_user_id: currentUserId,
      status: PARTICIPANT_STATUS_ENUM.PENDING,
    });

    if (error) {
      console.error('Error joining activity:', error.message);
      if (error.code === '23505') {
        showToast('You have already requested to join this activity.', 'info');
        setCurrentUserParticipationStatus(PARTICIPANT_STATUS_ENUM.PENDING);
      } else {
        showToast(`Failed to join activity: ${error.message}`, 'error');
      }
      return;
    }

    showToast('Request to join activity sent successfully', 'success');
    setCurrentUserParticipationStatus(PARTICIPANT_STATUS_ENUM.PENDING);

    // TODO: Add notification logic to send push notification to the host (hostUserId)
    // Example: await sendPushNotification(hostUserId, "New Join Request!", `${currentUser.first_name} wants to join your activity.`);
  };

  const fetchAndSetRequests = async () => {
    if (!activityId) {
      console.error('No activityId found');
      return;
    }

    const { data, error } = await supabase
      .from(TABLE_ENUM.ACTIVITY_PARTICIPANTS)
      .select(
        `
        id,
        guest_user_id,
        status,
        user:profiles(id, first_name, last_name)
        `
      )
      .eq('activity_id', activityId)
      .in('status', [PARTICIPANT_STATUS_ENUM.PENDING, PARTICIPANT_STATUS_ENUM.ACCEPTED]);

    if (error) {
      console.error('Error fetching pending requests:', error);
      showToast(`Failed to fetch requests: ${error.message}`, 'error');
      setPendingRequests(null);
    } else {
      const filteredPending = (data as unknown as IPendingActivityParticipant[]).filter(
        (item) => item.status === PARTICIPANT_STATUS_ENUM.PENDING
      );

      setPendingRequests(filteredPending);

      const filteredAccepted = (data as unknown as IPendingActivityParticipant[]).filter(
        (item) => item.status === PARTICIPANT_STATUS_ENUM.ACCEPTED
      );

      setAcceptedParticipants(filteredAccepted);
    }
  };

  const checkCurrentUserParticipation = async () => {
    if (!currentUserId || !activityId) return;

    const { data, error } = await supabase
      .from(TABLE_ENUM.ACTIVITY_PARTICIPANTS)
      .select('*')
      .eq('activity_id', activityId)
      .eq('guest_user_id', currentUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking participation status:', error);
    } else if (data) {
      setCurrentUserParticipationStatus(data.status as PARTICIPANT_STATUS_ENUM);
    } else {
      setCurrentUserParticipationStatus('none');
    }
  };

  useEffect(() => {
    if (currentUserId) {
      if (isCurrentUserActivity) {
        fetchAndSetRequests();
      } else {
        checkCurrentUserParticipation();
      }
    }
  }, [currentUserId, isCurrentUserActivity, activityId]);

  const handleManageRequestStatus = async (
    status: PARTICIPANT_STATUS_ENUM,
    participantId?: string,
    activityId?: string
  ) => {
    const query = supabase.from(TABLE_ENUM.ACTIVITY_PARTICIPANTS).update({ status: status });

    const { error } = activityId
      ? await query.eq('activity_id', activityId)
      : await query.eq('id', participantId);

    if (error) {
      console.error('Error managing request:', error);
      showToast(`Failed to manage request: ${error.message}`, 'error');
      return;
    }

    let statusText = '';

    switch (status) {
      case PARTICIPANT_STATUS_ENUM.ACCEPTED:
        statusText = 'accepted';
        break;
      case PARTICIPANT_STATUS_ENUM.COMPLETED:
        statusText = 'completed';
        break;
      case PARTICIPANT_STATUS_ENUM.DECLINED:
        statusText = 'declined';
        break;
    }

    if (status === PARTICIPANT_STATUS_ENUM.ACCEPTED && activityId) {
      await activityService.updateActivityStatus(
        activityId,
        ACTIVITY_LIFECYCLE_STATUS_ENUM.IN_PROGRESS
      );
    }

    showToast(`Request ${statusText}!`, 'success');
    await fetchAndSetRequests();
  };

  const deleteChat = async () => {
    const { error } = await supabase
      .from(TABLE_ENUM.MESSAGES)
      .delete()
      .match({ activity_id: activityId });

    if (error) {
      console.error('Error deleting messages', error);
      return;
    }
  };

  const rateUser = async (score: number) => {
    const { data: activityParticipantsData, error: activityParticipantsError } = await supabase
      .from(TABLE_ENUM.ACTIVITY_PARTICIPANTS)
      .select('*')
      .eq('activity_id', activityId)
      .single();

    if (activityParticipantsError) {
      console.error('Error fetching activity participants:', activityParticipantsError);
      throw new Error('Failed to fetch activity participants');
    }

    const { guest_user_id } = activityParticipantsData || {};

    const { data, error } = await supabase.rpc('add_review', {
      target_id: guest_user_id,
      new_rating: score,
    });

    if (error) {
      console.error('Error rating user:', error);
      throw new Error('Failed to rate user');
    }
  };

  const handleCompleteActivity = async (reviewScore: number, activityId: string) => {
    try {
      await Promise.all([
        rateUser(reviewScore),
        deleteChat(),
        activityService.updateActivityStatus(activityId, ACTIVITY_LIFECYCLE_STATUS_ENUM.COMPLETED),
        handleManageRequestStatus(PARTICIPANT_STATUS_ENUM.COMPLETED, activityId),
      ]);

      showToast('Activity completed successfully!', 'success');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error completing activity:', error);
        showToast(`Failed to complete activity: ${error.message}`, 'error');
      }
    }
  };

  return {
    pendingRequests,
    acceptedParticipants,
    currentUserParticipationStatus,
    handleJoinActivity,
    handleManageRequestStatus,
    handleCompleteActivity,
  };
};
