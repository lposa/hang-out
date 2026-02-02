import { ProfileDisplay } from '@/components/ProfileDisplay';
import { FORM_MODES, ProfileForm } from '@/components/ProfileForm/ProfileForm';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';
import { useProfile } from '@/hooks';
import { useHeaderHeight } from '@react-navigation/elements';

import { ScrollView } from 'react-native';
import { useState } from 'react';

export default function ProfileScreen() {
  const headerHeight = useHeaderHeight();
  const { profileLoading, profile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (profileLoading) {
    return <LoaderSpinner />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: 'transparent' }}
      contentContainerStyle={{ paddingVertical: headerHeight }}
      showsVerticalScrollIndicator={false}
    >
      {isEditing || !profile ? (
        <ProfileForm
          onDone={() => setIsEditing(false)}
          initialProfile={profile}
          formMode={isEditing ? FORM_MODES.EDIT : FORM_MODES.CREATE}
        />
      ) : (
        <ProfileDisplay profile={profile} onEdit={() => setIsEditing(true)} />
      )}
    </ScrollView>
  );
}
