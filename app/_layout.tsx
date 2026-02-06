import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { ScrollProvider } from '@/context/ScrollContext';
import { ToastProvider } from '@/context/ToastContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/services/Supabase';
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    Pacifico: require('@/assets/Pacifico-Regular.ttf'),
  });

  // If fonts fail to load, we'll proceed anyway
  const fontsReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth:', error);
        // Default to unauthenticated if there's an error
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });
      subscription = authSubscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setIsAuthenticated(false);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    // Add a timeout fallback to ensure splash screen doesn't stay forever
    const timeout = setTimeout(() => {
      if (isAuthenticated === undefined) {
        console.warn('Auth check timed out, defaulting to unauthenticated');
        setIsAuthenticated(false);
      }
      // Hide splash screen after timeout regardless
      SplashScreen.hideAsync();
    }, 5000); // 5 second timeout

    if (fontsReady && isAuthenticated !== undefined) {
      clearTimeout(timeout);
      SplashScreen.hideAsync();
    }

    return () => clearTimeout(timeout);
  }, [fontsReady, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated === undefined) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, router, segments]);

  const transparentTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: 'transparent',
      card: 'transparent',
    },
  };

  return (
    <ToastProvider>
      <ScrollProvider>
        <ThemeProvider value={transparentTheme}>
          <LinearGradient
            colors={['#F9FBFF', '#EEF3FF']}
            start={[0, 0]}
            end={[0, 1]}
            style={{ flex: 1 }}
          >
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
              initialRouteName="(auth)"
            >
              <Stack.Screen
                name="(auth)"
                options={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
              />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: 'modal',
                  title: 'Modal',
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </LinearGradient>
        </ThemeProvider>
      </ScrollProvider>
    </ToastProvider>
  );
}
