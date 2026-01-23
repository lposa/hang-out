import { useRouter } from 'expo-router';
import { supabase } from '@/services/Supabase';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { styles } from './LogoutButton.styles';
import { BlurView } from 'expo-blur';

interface ILogoutButtonProps {
  customStyle?: StyleProp<ViewStyle>; // Allow passing custom styles
}

export const LogoutButton = ({ customStyle }: ILogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Pressable onPress={handleLogout} style={[styles.buttonContainer, customStyle]}>
      <BlurView intensity={30} tint="dark" style={styles.glassEffect}>
        <MaterialIcons name="exit-to-app" size={24} color="#FFFFFF" />
      </BlurView>
    </Pressable>
  );
};
