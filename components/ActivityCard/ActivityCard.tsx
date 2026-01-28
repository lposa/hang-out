import { View, Image, ImageSourcePropType, Text, Pressable } from 'react-native';
import { styles } from './ActivityCard.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { ActivityPosterDetails } from '@/components/ActivityPosterDetails/ActivityPosterDetails';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { useMovieDb } from '@/hooks/useMovieDb';
import { GradientButton } from '@/components/elements';

export type ActivityPoster = {
  name: string;
  reviewScore: number;
  profilePic: ImageSourcePropType | undefined;
};

type Details = {
  time: string;
  price?: number;
  place: string;
  date: string;
  match?: number;
};

interface IActivityCardProps {
  activityName: string;
  activityPoster: ActivityPoster;
  activityDescription: string;
  activityType: ACTIVITY_TYPES_ENUM;
  details: Details;
}

export const ActivityCard = ({
  activityName,
  activityPoster,
  activityDescription,
  activityType,
  details,
}: IActivityCardProps) => {
  const { movie } = useMovieDb({ movieName: activityName });

  return (
    <View style={styles.activityContainer}>
      <View style={styles.profilePicContainer}>
        <Image source={activityPoster.profilePic} style={styles.profilePic} />
      </View>

      <ActivityPosterDetails
        name={activityPoster.name}
        reviewScore={activityPoster.reviewScore}
        match={details.match}
      />

      <View style={styles.activityInformationContainer}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle} numberOfLines={2} ellipsizeMode="tail">
            {activityName}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <MovieDetails movie={movie} />
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{details.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{details.place}</Text>
            </View>
            {details.price && (
              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={18} color="#666" />
                <Text style={styles.detailText}>{details.price} RSD</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{details.time}</Text>
            </View>
          </View>
        </View>
        <GradientButton text="Join Activity" />
      </View>
    </View>
  );
};
