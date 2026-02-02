import { ProfileDisplay } from '@/components/ProfileDisplay';

import { FORM_MODES, ProfileForm } from '@/components/ProfileForm/ProfileForm';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';
import { useProfile } from '@/hooks';
import { useHeaderHeight } from '@react-navigation/elements';

import { useState } from 'react';
import { ScrollView } from 'react-native';
import { EditCardsForm } from '@/components/EditCardsForm';

export enum SCREEN_MODE_ENUM {
  DISPLAY = 'display',
  EDIT = 'edit',
  EDIT_PICK = 'editPicks',
}

export default function ProfileScreen() {
  const headerHeight = useHeaderHeight();
  const { profileLoading, profile, refetch } = useProfile();
  const [screenMode, setScreenMode] = useState<SCREEN_MODE_ENUM>(SCREEN_MODE_ENUM.DISPLAY);

  if (profileLoading) {
    return <LoaderSpinner />;
  }

  const handleSelectScreenMode = (screenMode: SCREEN_MODE_ENUM) => {
    setScreenMode(screenMode);
  };

  const handleProfileUpdate = () => {
    refetch?.();
  };

  const renderContent = () => {
    if (screenMode === 'edit' || !profile) {
      return (
        <ProfileForm
          onDone={() => {
            handleSelectScreenMode(SCREEN_MODE_ENUM.DISPLAY);
            handleProfileUpdate();
          }}
          initialProfile={profile}
          formMode={screenMode === 'edit' ? FORM_MODES.EDIT : FORM_MODES.CREATE}
        />
      );
    }

    if (screenMode === 'editPicks') {
      return (
        <EditCardsForm
          data={profile.top_ten_movies || []}
          userId={profile.id || ''}
          onDone={() => handleSelectScreenMode(SCREEN_MODE_ENUM.DISPLAY)}
        />
      );
    }

    return (
      <ProfileDisplay
        profile={profile}
        onEdit={(screenMode) => handleSelectScreenMode(screenMode)}
      />
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: 'transparent' }}
      contentContainerStyle={{ paddingVertical: headerHeight }}
      showsVerticalScrollIndicator={false}
    >
      {renderContent()}
    </ScrollView>
  );
}
