import { ProfileDisplay } from '@/components/ProfileDisplay';
import { ProfileForm } from '@/components/ProfileForm/ProfileForm';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';
import { useProfile } from '@/hooks';
import { useHeaderHeight } from '@react-navigation/elements';

import { ScrollView } from 'react-native';

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
      showsVerticalScrollIndicator={false}
    >
      {profile ? <ProfileDisplay profile={profile} /> : <ProfileForm />}
    </ScrollView>
  );
}
