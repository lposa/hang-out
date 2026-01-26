import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView, Text } from 'react-native';
import { ProfileForm } from '@/components/ProfileForm/ProfileForm';

export default function ProfileScreen() {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView
      style={{ backgroundColor: 'transparent' }}
      contentContainerStyle={{ paddingTop: headerHeight }}
    >
      <ProfileForm />
    </ScrollView>
  );
}
