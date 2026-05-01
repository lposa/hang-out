import { styles } from './UserMatchBar.style';
import { Pressable, Text, View, StyleProp, ViewStyle } from 'react-native';
import { PROGRESS_BAR_VARIANT_ENUM, ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';
import { Ionicons } from '@expo/vector-icons';

interface IUserMatchBarProps {
  matchScore: number | undefined;
  calculateUserMatch: () => void;
  loading: boolean;
  externalStyles?: StyleProp<ViewStyle>;
  progressBarVariant?: PROGRESS_BAR_VARIANT_ENUM;
  onScorePress?: () => void;
}

export const UserMatchBar = ({
  matchScore,
  calculateUserMatch,
  loading,
  externalStyles,
  progressBarVariant = PROGRESS_BAR_VARIANT_ENUM.LINEAR,
  onScorePress,
}: IUserMatchBarProps) => {
  if (loading) {
    return <LoaderSpinner size={18} color="#6366F1" />;
  }

  if (progressBarVariant === PROGRESS_BAR_VARIANT_ENUM.CIRCULAR) {
    return (
      <View style={[styles.matchContainerCircular, externalStyles]}>
        {matchScore === undefined ? (
          <Pressable
            style={[styles.circularPlaceholderButton, loading && styles.calculateButtonDisabled]}
            onPress={calculateUserMatch}
            disabled={loading}
          >
            {loading ? (
              <LoaderSpinner size={18} color="#6366F1" />
            ) : (
              <>
                <Ionicons name="sparkles-outline" size={16} color="#6366F1" />
                <Text style={styles.circularPlaceholderText}>Analyze</Text>
              </>
            )}
          </Pressable>
        ) : (
          <Pressable
            style={[styles.circularInteractiveArea, loading && styles.calculateButtonDisabled]}
            onPress={onScorePress}
            disabled={loading}
          >
            <ProgressBar match={matchScore} variant={PROGRESS_BAR_VARIANT_ENUM.CIRCULAR} />
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.matchContainer, externalStyles]}>
      {matchScore !== undefined ? (
        <>
          <Text style={styles.matchScoreText}>Compatibility: {Math.floor(matchScore)}%</Text>
          <ProgressBar match={matchScore} variant={progressBarVariant} />
        </>
      ) : (
        <Pressable
          style={[styles.calculateButton, loading && styles.calculateButtonDisabled]}
          onPress={calculateUserMatch}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.calculateButtonContent}>
              <LoaderSpinner size={14} color="#FFFFFF" />
              <Text style={styles.calculateButtonText}>Calculating...</Text>
            </View>
          ) : (
            <View style={styles.calculateButtonContent}>
              <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
              <Text style={styles.calculateButtonText}>Calculate match</Text>
            </View>
          )}
        </Pressable>
      )}
    </View>
  );
};
