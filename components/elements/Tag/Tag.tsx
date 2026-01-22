import { View, Text } from 'react-native';
import { styles } from './Tag.styles';

export const Tag = ({
  text,
  backgroundColor = '#FF5F6D',
}: {
  text: string;
  backgroundColor?: string;
}) => {
  return (
    <View style={[{ backgroundColor }, styles.tagContainer]}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
};
