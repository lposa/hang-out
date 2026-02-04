import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import { AddActivityForm } from '@/components/AddActivityForm';
import { AppModal } from '@/components/Modal';
import { TabMenu } from '@/components/TabMenu';
import { TAB_ENUM } from '@/constants';
import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { MaterialIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useState } from 'react';

const MOCK_USER = {
  name: 'Leonard Posa',
  reviewScore: 4.7,
  profilePic: require('@/assets/images/leonard_posa.jpeg'),
};

const MOCK_ACTIVITY = {
  activityName: 'Avengers: Doomsday',
  activityPoster: MOCK_USER,
  activityDescription: 'Come and enjoy a movie night with friends!',
  activityType: ACTIVITY_TYPES_ENUM.MOVIE,
  details: {
    time: '18:00',
    price: 850.0,
    date: 'December 20th, 2026.',
    place: 'Cinestar Zrenjanin',
    match: 100,
  },
};

const MOCK_ACTIVITY_2 = {
  activityName: 'Dune: Part Three',
  activityPoster: MOCK_USER,
  activityDescription: 'Come and enjoy a movie night with friends!',
  activityType: ACTIVITY_TYPES_ENUM.MOVIE,
  details: {
    time: '18:00',
    price: 850.0,
    date: 'December 20th, 2026.',
    place: 'Cinestar Zrenjanin',
    match: 56.2,
  },
};

export default function HomeScreen() {
  const headerHeight = useHeaderHeight();
  const [activeTab, setActiveTab] = useState<TAB_ENUM>(TAB_ENUM.ALL);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleStickyPress = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AppModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Add Activity"
      >
        <AddActivityForm />
      </AppModal>
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={{ paddingVertical: headerHeight }}
      >
        <TabMenu
          activeTab={activeTab}
          handleActiveTabPress={(tab) => setActiveTab(tab)}
          tabGroups={[TAB_ENUM.ALL, TAB_ENUM.MY_ACTIVITIES]}
        />

        {activeTab === TAB_ENUM.ALL && (
          <>
            <ActivityCard {...MOCK_ACTIVITY} />
            <ActivityCard {...MOCK_ACTIVITY_2} />
          </>
        )}
      </ScrollView>

      <Pressable
        style={[styles.stickyButton, { top: insets.top + 60 }]}
        onPress={handleStickyPress}
      >
        <LinearGradient
          colors={['#FF5F6D', '#FFC371']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.stickyButtonGradient}
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.stickyButtonText}>Add Activity</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  stickyButton: {
    position: 'absolute',
    right: 20,
    borderRadius: 28,
    shadowColor: '#FF5F6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    overflow: 'hidden',
  },
  stickyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  stickyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
