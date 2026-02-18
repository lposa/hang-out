import { useEffect, useState } from 'react';
import { ACTIVITY_STATUS_ENUM, IPendingActivityParticipant } from '@/components/ActivityCard/types';
import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';
import { useToast } from '@/context/ToastContext';

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
    ACTIVITY_STATUS_ENUM | 'none'
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
      status: ACTIVITY_STATUS_ENUM.PENDING,
    });

    if (error) {
      console.error('Error joining activity:', error.message);
      if (error.code === '23505') {
        showToast('You have already requested to join this activity.', 'info');
        setCurrentUserParticipationStatus(ACTIVITY_STATUS_ENUM.PENDING);
      } else {
        showToast(`Failed to join activity: ${error.message}`, 'error');
      }
      return;
    }

    showToast('Request to join activity sent successfully', 'success');
    setCurrentUserParticipationStatus(ACTIVITY_STATUS_ENUM.PENDING);

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
      .in('status', [ACTIVITY_STATUS_ENUM.PENDING, ACTIVITY_STATUS_ENUM.ACCEPTED]);

    if (error) {
      console.error('Error fetching pending requests:', error);
      showToast(`Failed to fetch requests: ${error.message}`, 'error');
      setPendingRequests(null);
    } else {
      const filteredPending = (data as unknown as IPendingActivityParticipant[]).filter(
        (item) => item.status === ACTIVITY_STATUS_ENUM.PENDING
      );

      setPendingRequests(filteredPending);

      const filteredAccepted = (data as unknown as IPendingActivityParticipant[]).filter(
        (item) => item.status === ACTIVITY_STATUS_ENUM.ACCEPTED
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
      setCurrentUserParticipationStatus(data.status as ACTIVITY_STATUS_ENUM);
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

  const handleMangeRequestStatus = async (participantId: string, status: ACTIVITY_STATUS_ENUM) => {
    const { error } = await supabase
      .from(TABLE_ENUM.ACTIVITY_PARTICIPANTS)
      .update({ status: status })
      .eq('id', participantId);

    if (error) {
      console.error('Error managing request:', error);
      showToast(`Failed to manage request: ${error.message}`, 'error');
      return;
    }

    const statusText = status === ACTIVITY_STATUS_ENUM.ACCEPTED ? 'Accepted' : 'Declined';

    showToast(`Request ${statusText}!`, 'success');
    await fetchAndSetRequests();
  };

  return {
    pendingRequests,
    acceptedParticipants,
    currentUserParticipationStatus,
    handleJoinActivity,
    handleMangeRequestStatus,
  };
};
