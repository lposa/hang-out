import { Text, View } from 'react-native';
import { styles } from './ProgressBar.styles';
import Svg, { Circle } from 'react-native-svg';

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

export enum PROGRESS_BAR_VARIANT_ENUM {
  LINEAR = 'linear',
  CIRCULAR = 'circular',
}

interface IProgressBarProps {
  match: number;
  variant?: PROGRESS_BAR_VARIANT_ENUM;
}

export const ProgressBar = ({
  match,
  variant = PROGRESS_BAR_VARIANT_ENUM.LINEAR,
}: IProgressBarProps) => {
  const clampedMatch = Math.min(Math.max(match || 0, 0), 100);
  const progressColor = getColorForPercentage(clampedMatch);

  if (variant === PROGRESS_BAR_VARIANT_ENUM.CIRCULAR) {
    const size = 60;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - clampedMatch / 100);

    return (
      <View style={styles.circularWrapper}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D1D5DB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.circularCenterLabel}>
          <Text style={styles.circularPercentText}>Match</Text>
          <Text style={styles.circularPercentText}>{Math.round(clampedMatch)}%</Text>
        </View>
      </View>
    );
  }

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
