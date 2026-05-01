import { Text, View } from 'react-native';
import { styles } from './ActivityPosterDetails.styles';
import { useCalculateUserMatch } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import { UserMatchBar } from '@/components/UserMatchBar';
import { PROGRESS_BAR_VARIANT_ENUM } from '@/components/ProgressBar/ProgressBar';
import { router, Href } from 'expo-router';

interface IActivityPosterProps {
  name: string;
  reviewScore: number;
  userId: string;
  category?: 'movies' | 'books' | 'tv_shows';
}

export const ActivityPosterDetails = ({
  name,
  reviewScore,
  userId,
  category = 'movies',
}: IActivityPosterProps) => {
  const { loading, calculateUserMatch, matchScore } = useCalculateUserMatch({
    userId,
    category,
  });

  const handleScorePress = () => {
    router.push(`/(profile)/profile-screen/${userId}?tab=AI+Analysis` as Href);
  };

  return (
    <View style={styles.activityPosterDetailsContainer}>
      <View style={styles.posterInfo}>
        <Text style={styles.posterName} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={18} color="#f5a623" />
          <Text style={styles.reviewScoreText}>{reviewScore.toFixed(1)}</Text>
        </View>
      </View>

      <UserMatchBar
        matchScore={matchScore}
        calculateUserMatch={calculateUserMatch}
        loading={loading}
        progressBarVariant={PROGRESS_BAR_VARIANT_ENUM.CIRCULAR}
        onScorePress={handleScorePress}
      />
    </View>
  );
};
