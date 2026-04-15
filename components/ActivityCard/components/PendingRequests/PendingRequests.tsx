import { Image, Pressable, Text, View } from 'react-native';
import { styles } from './PendingRequests.style';
import { Ionicons } from '@expo/vector-icons';
import { ACTIVITY_STATUS_ENUM, IPendingActivityParticipant } from '@/components/ActivityCard/types';

interface IPendingRequestsProps {
  pendingRequests: IPendingActivityParticipant[] | null;
  handleOpenProfile: (profileId: string) => void;
  activityId: string;
  handleMangeRequestStatus: (status: ACTIVITY_STATUS_ENUM, id: string, activityId?: string) => void;
}

export const PendingRequests = ({
  pendingRequests,
  handleOpenProfile,
  handleMangeRequestStatus,
}: IPendingRequestsProps) => {
  return (
    <View style={styles.requestsSection}>
      <Text style={styles.requestsHeader}>Pending Requests:</Text>
      {pendingRequests && pendingRequests.length > 0 ? (
        <View>
          {pendingRequests.map((item) => (
            <View key={item.id} style={styles.requestItem}>
              <Pressable onPress={() => handleOpenProfile(item.user.id)}>
                <Image
                  source={
                    item.user.avatar_url
                      ? { uri: item.user.avatar_url }
                      : require('@/assets/images/leonard_posa.jpeg')
                  }
                  style={styles.requestUserAvatar}
                />
              </Pressable>
              <Text style={styles.requestUserName}>
                {item.user.first_name} {item.user.last_name}
              </Text>
              <View style={styles.requestActions}>
                <Pressable
                  style={styles.acceptButton}
                  onPress={() => handleMangeRequestStatus(ACTIVITY_STATUS_ENUM.ACCEPTED, item.id)}
                >
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                </Pressable>
                <Pressable
                  style={styles.declineButton}
                  onPress={() => handleMangeRequestStatus(ACTIVITY_STATUS_ENUM.DECLINED, item.id)}
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noRequestsText}>No pending requests for this activity.</Text>
      )}
    </View>
  );
};
