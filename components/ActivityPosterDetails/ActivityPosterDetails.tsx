import { Text, View } from 'react-native';
import { styles } from './ActivityPosterDetails.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';

interface IActivityPosterProps {
  name: string;
  reviewScore: number;
  match?: number | undefined;
}

const renderStars = (reviewScore: number) => {
  const filledStars = Math.floor(reviewScore);
  const hasHalfStar = reviewScore % 1 >= 0.5;

  return [...Array(5)].map((_, index) => {
    if (index < filledStars) {
      return <Ionicons key={index} name="star" size={18} color="#f5a623" />;
    }
    if (index === filledStars && hasHalfStar) {
      return <Ionicons key={index} name="star-half" size={18} color="#f5a623" />;
    }
    return <Ionicons key={index} name="star-outline" size={18} color="#999" />;
  });
};

export const ActivityPosterDetails = ({ name, reviewScore, match }: IActivityPosterProps) => {
  return (
    <View style={styles.activityPosterDetailsContainer}>
      <View style={styles.posterInfo}>
        <Text style={styles.posterName} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>{renderStars(reviewScore)}</View>
          <Text style={styles.reviewScoreText}>{reviewScore.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.matchContainer}>
        <Text style={styles.matchScoreText}>Users match: {Math.floor(match || 0)}%</Text>
        <ProgressBar match={match || 0} />
      </View>
    </View>
  );
};
