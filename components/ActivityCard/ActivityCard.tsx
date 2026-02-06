import { ActivityPosterDetails } from '@/components/ActivityPosterDetails/ActivityPosterDetails';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { GradientButton } from '@/components/elements';
import { Activity } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import { styles } from './ActivityCard.styles';

interface IActivityCardProps {
  activityData: Activity;
  isCurrentUserActivity?: boolean;
}

export const ActivityCard = ({
  activityData,
  isCurrentUserActivity = false,
}: IActivityCardProps) => {
  const { user_id, first_name, last_name, activity_type, activity_data, date, time, place, price } =
    activityData;

  return (
    <View
      style={[
        styles.activityContainer,
        isCurrentUserActivity ? { marginTop: 20 } : { marginTop: 100 },
      ]}
    >
      {!isCurrentUserActivity && (
        <>
          <View style={styles.profilePicContainer}>
            <Image
              source={require('@/assets/images/leonard_posa.jpeg')}
              style={styles.profilePic}
            />
          </View>

          <ActivityPosterDetails
            name={`${first_name} ${last_name}`}
            reviewScore={5}
            userId={user_id}
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
            {activity_data?.title}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <MovieDetails movie={activity_data} />
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
        {!isCurrentUserActivity && <GradientButton text="Join Activity" />}
      </View>
    </View>
  );
};
