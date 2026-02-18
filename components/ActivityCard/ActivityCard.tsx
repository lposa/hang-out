import { ActivityPosterDetails } from '@/components/ActivityPosterDetails/ActivityPosterDetails';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { GradientButton } from '@/components/elements';
import { Activity } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import { styles } from './ActivityCard.styles';
import { Href, router } from 'expo-router';
import { ACTIVITY_STATUS_ENUM } from './types';
import { useActivity } from '@/components/ActivityCard/hooks/useActivity';
import { AcceptedRequests, PendingRequests } from '@/components/ActivityCard/components';

interface IActivityCardProps {
  activityData: Activity;
  isCurrentUserActivity?: boolean;
}

export const ActivityCard = ({
  activityData,
  isCurrentUserActivity = false,
}: IActivityCardProps) => {
  const {
    id: activityId,
    user_id: hostUserId,
    first_name,
    last_name,
    activity_data: activityDetails,
    date,
    time,
    place,
    price,
  } = activityData;

  const {
    pendingRequests,
    acceptedParticipants,
    currentUserParticipationStatus,
    handleJoinActivity,
    handleMangeRequestStatus,
  } = useActivity({ isCurrentUserActivity, activityId });

  const handleOpenProfile = (profileId: string) => {
    router.push(`/(profile)/profile-screen/${profileId}` as Href);
  };

  return (
    <View
      style={[
        styles.activityContainer,
        isCurrentUserActivity ? { marginTop: 20 } : { marginTop: 100 },
      ]}
    >
      {!isCurrentUserActivity && (
        <>
          <Pressable
            style={styles.profilePicContainer}
            onPress={() => handleOpenProfile(hostUserId)}
          >
            <Image
              source={require('@/assets/images/leonard_posa.jpeg')}
              style={styles.profilePic}
            />
          </Pressable>

          <ActivityPosterDetails
            name={`${first_name} ${last_name}`}
            reviewScore={5}
            userId={hostUserId}
          />
        </>
      )}

      <View
        style={[
          styles.activityInformationContainer,
          isCurrentUserActivity ? { paddingTop: 20 } : { paddingTop: 85 },
        ]}
      >
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle} numberOfLines={2} ellipsizeMode="tail">
            {activityDetails?.title}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <MovieDetails movie={activityDetails} />
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{place}</Text>
            </View>
            {price && (
              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={18} color="#666" />
                <Text style={styles.detailText}>{price} RSD</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{time}</Text>
            </View>
          </View>
        </View>

        {!isCurrentUserActivity && (
          <>
            {currentUserParticipationStatus === 'none' && (
              <GradientButton text="Join Activity" onPress={handleJoinActivity} />
            )}
            {currentUserParticipationStatus === ACTIVITY_STATUS_ENUM.PENDING && (
              <Text style={styles.statusText}>Request Sent. Waiting for host approval.</Text>
            )}
            {currentUserParticipationStatus === ACTIVITY_STATUS_ENUM.ACCEPTED && (
              <GradientButton
                text="View Chat"
                onPress={() => router.push(`/(chat)/${activityId}` as Href)}
              />
            )}
            {currentUserParticipationStatus === ACTIVITY_STATUS_ENUM.DECLINED && (
              <Text style={styles.statusText}>Your request was declined.</Text>
            )}
          </>
        )}

        {isCurrentUserActivity && acceptedParticipants && acceptedParticipants.length > 0 && (
          <AcceptedRequests
            acceptedParticipants={acceptedParticipants}
            handleOpenProfile={handleOpenProfile}
            handleManageRequestStatus={handleMangeRequestStatus}
            activityId={activityId}
          />
        )}

        {isCurrentUserActivity &&
          pendingRequests &&
          pendingRequests?.length > 0 &&
          acceptedParticipants &&
          acceptedParticipants.length === 0 && (
            <PendingRequests
              pendingRequests={pendingRequests}
              handleOpenProfile={handleOpenProfile}
              activityId={activityId}
              handleMangeRequestStatus={handleMangeRequestStatus}
            />
          )}
      </View>
    </View>
  );
};
