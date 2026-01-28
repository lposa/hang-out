import { styles } from './GradientButton.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';

interface IGradientButtonProps {
  disabled?: boolean;
  text: string;
  onPress?: () => void;
  loading?: boolean;
}

export const GradientButton = ({ disabled, text, onPress, loading }: IGradientButtonProps) => {
  return (
    <Pressable
      style={[styles.actionButton, disabled && { opacity: 0.5 }]}
      disabled={disabled}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#FFC371', '#FF5F6D', '#D92550']}
        start={[0, 0.5]}
        end={[1, 0.5]}
        style={styles.actionButtonGradient}
      >
        {loading ? (
          <LoaderSpinner size={24} color="#FFFFFF" />
        ) : (
          <Text style={styles.actionButtonText}>{text}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};
