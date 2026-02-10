import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { IUserMatch } from '@/app/(profile)/profile-screen/[id]';
import { styles } from './AiAnalysisDisplay.style';
import { getColorForPercentage } from '@/components/ProgressBar/ProgressBar';

const SectionHeader = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.sectionHeader}>
    <Ionicons name={icon as any} size={20} color="#FFFFFF" />
    <Text style={styles.sectionHeaderText}>{label}</Text>
  </View>
);

export const AiAnalysisDisplay = ({ notes, score, shared_tags, shared_items }: IUserMatch) => {
  const scoreColor = getColorForPercentage(score || 0);

  const getGradientColors = (baseColor: string) => {
    const colorMap: Record<string, [string, string, string]> = {
      '#10B981': ['#10B981', '#059669', '#047857'],
      '#3B82F6': ['#3B82F6', '#2563EB', '#1D4ED8'],
      '#8B5CF6': ['#8B5CF6', '#7C3AED', '#6D28D9'],
      '#F59E0B': ['#F59E0B', '#D97706', '#B45309'],
      '#EF4444': ['#EF4444', '#DC2626', '#B91C1C'],
    };
    return colorMap[baseColor] || ['#6366F1', '#4F46E5', '#4338CA'];
  };

  const matchGradient = getGradientColors(scoreColor);

  return (
    <View style={styles.aiAnalysisDisplayContainer}>
      <LinearGradient
        colors={matchGradient}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.matchContainer}
      >
        <SectionHeader icon="heart" label="Match Overview" />
        <View style={styles.matchContent}>
          {score !== undefined && score !== null && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{score}%</Text>
            </View>
          )}
          {notes && <Text style={styles.noteText}>{notes}</Text>}
        </View>
      </LinearGradient>

      {shared_items && shared_items.length > 0 && (
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#A855F7']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.sectionContainer}
        >
          <SectionHeader icon="film" label="Mutual Likes" />
          <View style={styles.itemsGrid}>
            {shared_items.map((item, index) => (
              <View key={index} style={styles.itemChip}>
                <Text style={styles.itemChipText}>{item}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      )}

      {shared_tags && shared_tags.length > 0 && (
        <LinearGradient
          colors={['#3B82F6', '#06B6D4', '#10B981']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.sectionContainer}
        >
          <SectionHeader icon="pricetag" label="Mutual Genres" />
          <View style={styles.itemsGrid}>
            {shared_tags.map((item, index) => (
              <View key={index} style={styles.itemChip}>
                <Text style={styles.itemChipText}>{item}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      )}
    </View>
  );
};
