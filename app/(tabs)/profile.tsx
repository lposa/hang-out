import { View, Text, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

export default function ProfileScreen() {
  const headerHeight = useHeaderHeight(); // Get the exact height of the header

  return (
    <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
      <Text>Profile</Text>
    </ScrollView>
  );
}
