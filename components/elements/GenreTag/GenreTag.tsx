import { View, Text } from 'react-native';
import { styles } from './GenreTag.styles';

export const GenreTag = ({ text }: { text: string }) => {
  return (
    <View style={styles.genreTagContainer}>
      <Text style={styles.genreTagText}>{text}</Text>
    </View>
  );
};
