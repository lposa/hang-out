import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, useWindowDimensions, View, Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

const TAB_WIDTH = 200;

export default function TabLayout() {
  const { width } = useWindowDimensions();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: [
          styles.tabBar,
          {
            width: TAB_WIDTH,
            marginHorizontal: (width - TAB_WIDTH) / 2, // centering
          },
        ],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'HOME',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                styles.iconContainerFirst,
                focused && styles.iconContainerActive,
              ]}
            >
              <IconSymbol name="house.fill" size={22} color={color} />
              <Text style={styles.iconLabel}>Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                styles.iconContainerLast,
                focused && styles.iconContainerActive,
              ]}
            >
              <IconSymbol name="person.fill" size={22} color={color} />
              <Text style={styles.iconLabel}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    position: 'absolute',
    bottom: 16,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#374151',
    borderWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    padding: 0,
  },

  iconContainer: {
    height: 64,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFirst: {
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  iconContainerLast: {
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconContainerActive: {
    backgroundColor: '#1F2937',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
    letterSpacing: 0.5,
  },

  iconLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
