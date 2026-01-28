import { useRouter } from 'expo-router';
import { supabase } from '@/services/Supabase';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { styles } from './LogoutButton.styles';

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
      <MaterialIcons name="exit-to-app" size={24} color="#111827" />
    </Pressable>
  );
};
