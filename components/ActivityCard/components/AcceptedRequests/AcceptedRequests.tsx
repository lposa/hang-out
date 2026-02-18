import { Image, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AcceptedRequests.style';
import { ACTIVITY_STATUS_ENUM, IPendingActivityParticipant } from '@/components/ActivityCard/types';
import { Href, router } from 'expo-router';

interface IAcceptedRequestsProps {
  acceptedParticipants: IPendingActivityParticipant[];
  handleOpenProfile: (profileId: string) => void;
  handleManageRequestStatus: (id: string, status: ACTIVITY_STATUS_ENUM) => void;
  activityId: string;
}

export const AcceptedRequests = ({
  acceptedParticipants,
  handleOpenProfile,
  handleManageRequestStatus,
  activityId,
}: IAcceptedRequestsProps) => {
  return (
    <View style={styles.acceptedSection}>
      <View style={styles.headerContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        <Text style={styles.sectionHeader}>Accepted Participants</Text>
      </View>

      {acceptedParticipants && acceptedParticipants.length > 0 ? (
        <View style={styles.participantsList}>
          {acceptedParticipants.map((participant) => (
            <LinearGradient
              key={participant.id}
              colors={['#F0FDF4', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.participantCard}
            >
              <View style={styles.participantInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={
                      participant.user.avatar_url
                        ? { uri: participant.user.avatar_url }
                        : require('@/assets/images/leonard_posa.jpeg')
                    }
                    style={styles.avatar}
                  />
                  <View style={styles.statusBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {participant.user.first_name} {participant.user.last_name}
                  </Text>
                  <Text style={styles.statusText}>Accepted</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <Pressable
                  style={styles.chatButton}
                  onPress={() => router.push(`/(chat)/${activityId}` as Href)}
                >
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.chatButtonGradient}
                  >
                    <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
                    <Text style={styles.chatButtonText}>Chat</Text>
                  </LinearGradient>
                </Pressable>
                <Pressable
                  style={styles.viewProfileButton}
                  onPress={() => handleOpenProfile(participant.user.id)}
                >
                  <Ionicons name="person-outline" size={18} color="#10B981" />
                  <Text style={styles.viewProfileText}>View</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() =>
                    handleManageRequestStatus(participant.id, ACTIVITY_STATUS_ENUM.DECLINED)
                  }
                >
                  <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            </LinearGradient>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No accepted participants yet</Text>
        </View>
      )}
    </View>
  );
};
