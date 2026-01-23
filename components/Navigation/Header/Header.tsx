import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoutButton } from '@/components/LogoutButton';
import { HangOutLogo } from '@/svg/logo';
import { styles } from './Header.styles';

export const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#82D0EE', '#3AAAD9']} start={[0, 0]} end={[1, 0]} style={{ flex: 1 }}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <HangOutLogo width={120} height={64} />
        <LogoutButton customStyle={styles.logoutBtn} />
      </View>
    </LinearGradient>
  );
};
