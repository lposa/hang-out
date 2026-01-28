import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView } from 'react-native';
import { ProfileForm } from '@/components/ProfileForm/ProfileForm';
import { useProfile } from '@/hooks';
import { ProfileDisplay } from '@/components/ProfileDisplay';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';

export default function ProfileScreen() {
  const headerHeight = useHeaderHeight();
  const { profileLoading, profile } = useProfile();

  if (profileLoading) {
    return <LoaderSpinner />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: 'transparent' }}
      contentContainerStyle={{ paddingVertical: headerHeight }}
    >
      {profile ? <ProfileDisplay profile={profile} /> : <ProfileForm />}
    </ScrollView>
  );
}
