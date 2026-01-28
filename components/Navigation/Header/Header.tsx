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
    <LinearGradient
      colors={['#F4F7FB', '#E0ECFF']}
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <HangOutLogo width={120} height={64} />
        <LogoutButton customStyle={styles.logoutBtn} />
      </View>
    </LinearGradient>
  );
};
