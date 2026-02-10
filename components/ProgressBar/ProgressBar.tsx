import { View } from 'react-native';
import { styles } from './ProgressBar.styles';

export const getColorForPercentage = (percent: number): string => {
  if (percent <= 10) return '#FF0000';
  if (percent <= 20) return '#FF4500';
  if (percent <= 30) return '#FF8C00';
  if (percent <= 40) return '#FFA500';
  if (percent <= 50) return '#FFD700';
  if (percent <= 60) return '#FFFF00';
  if (percent <= 70) return '#ADFF2F';
  if (percent <= 80) return '#7FFF00';
  if (percent <= 90) return '#32CD32';
  return '#00FF00';
};

export const ProgressBar = ({ match }: { match: number }) => {
  const clampedMatch = Math.min(Math.max(match || 0, 0), 100);
  const progressColor = getColorForPercentage(clampedMatch);
  const numberOfSquares = Math.floor(clampedMatch / 10);

  return (
    <View style={styles.progressBarContainer}>
      {Array.from({ length: 10 }).map((_, index) => {
        const isFilled = index < numberOfSquares;
        const isFirst = index === 0;
        const isLast = index === 9;

        return (
          <View
            key={index}
            style={[
              styles.square,
              isFilled && { backgroundColor: progressColor },
              isFirst && { borderBottomLeftRadius: 10, borderTopLeftRadius: 10 },
              isLast && { borderBottomRightRadius: 10, borderTopRightRadius: 10 },
            ]}
          />
        );
      })}
    </View>
  );
};
