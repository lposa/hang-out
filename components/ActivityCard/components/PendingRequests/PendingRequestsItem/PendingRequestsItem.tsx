import { Image, Pressable, Text, View } from 'react-native';
import {
  IPendingActivityParticipant,
  PARTICIPANT_STATUS_ENUM,
} from '@/components/ActivityCard/types';
import { Ionicons } from '@expo/vector-icons';
import { useCalculateUserMatch } from '@/hooks';
import { styles } from './PendingRequestsItem.style';
import { UserMatchBar } from '@/components/UserMatchBar';
import { PROGRESS_BAR_VARIANT_ENUM } from '@/components/ProgressBar/ProgressBar';

interface IPendingRequestsItemProps {
  pendingRequest: IPendingActivityParticipant;
  handleOpenProfile: (profileId: string) => void;
  handleMangeRequestStatus: (
    status: PARTICIPANT_STATUS_ENUM,
    id: string,
    activityId?: string
  ) => void;
}

export const PendingRequestsItem = ({
  pendingRequest,
  handleOpenProfile,
  handleMangeRequestStatus,
}: IPendingRequestsItemProps) => {
  const { loading, calculateUserMatch, matchScore } = useCalculateUserMatch({
    userId: pendingRequest.guest_user_id,
    category: 'movies',
  });

  return (
    <View key={pendingRequest.id} style={styles.requestItem}>
      <View style={styles.requestHeader}>
        <View style={styles.requestUserInfo}>
          <Pressable onPress={() => handleOpenProfile(pendingRequest.user.id)}>
            <Image
              source={
                pendingRequest.user.avatar
                  ? { uri: pendingRequest.user.avatar }
                  : require('@/assets/images/profile-placeholder.png')
              }
              style={styles.requestUserAvatar}
            />
          </Pressable>
          <Text style={styles.requestUserName}>
            {pendingRequest.user.first_name} {pendingRequest.user.last_name}
          </Text>
        </View>
        <View style={styles.matchTopRight}>
          <UserMatchBar
            matchScore={matchScore}
            calculateUserMatch={calculateUserMatch}
            loading={loading}
            progressBarVariant={PROGRESS_BAR_VARIANT_ENUM.CIRCULAR}
            externalStyles={styles.compactMatchContainer}
          />
        </View>
      </View>
      <View style={styles.requestActions}>
        <Pressable
          style={styles.acceptButton}
          onPress={() =>
            handleMangeRequestStatus(PARTICIPANT_STATUS_ENUM.ACCEPTED, pendingRequest.id)
          }
        >
          <Ionicons name="checkmark-outline" size={18} color="#10B981" />
          <Text style={styles.actionButtonText}>Accept</Text>
        </Pressable>
        <Pressable
          style={styles.declineButton}
          onPress={() =>
            handleMangeRequestStatus(PARTICIPANT_STATUS_ENUM.DECLINED, pendingRequest.id)
          }
        >
          <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
          <Text style={styles.declineButtonText}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
};
