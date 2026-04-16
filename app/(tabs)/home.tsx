import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Pressable, StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import { AddActivityForm } from '@/components/AddActivityForm';
import { AppModal } from '@/components/Modal';
import { TabMenu } from '@/components/TabMenu';
import { TAB_ENUM } from '@/constants';
import { activityService } from '@/services';
import { Activity } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useState, useRef } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TAB_ENUM>(TAB_ENUM.ALL);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);

  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isButtonCurrentlyHidden, setIsButtonCurrentlyHidden] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleStickyPress = () => {
    setIsModalVisible(true);
  };

  const fetchActivities = async () => {
    const activities = await activityService.fetchAllActivities();
    setActivities(activities);
  };

  const fetchUserActivities = async () => {
    const userActivities = await activityService.fetchCurrentUserActivities();
    setUserActivities(userActivities);
  };

  const addActivityCallback = async () => {
    await Promise.all([fetchActivities(), fetchUserActivities()]);
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchActivities();
    fetchUserActivities();
  }, []);

  const renderActivities = () => {
    if (activities.length === 0) {
      return <Text>No Activities Found</Text>;
    }

    return activities.map((activity) => <ActivityCard key={activity.id} activityData={activity} />);
  };

  const showButton = () => {
    if (isButtonCurrentlyHidden) {
      Animated.timing(buttonTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsButtonCurrentlyHidden(false));
    }
  };

  const hideButton = () => {
    if (!isButtonCurrentlyHidden) {
      Animated.timing(buttonTranslateX, {
        toValue: SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsButtonCurrentlyHidden(true));
    }
  };

  const handleScroll = (event: any) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }

    if (!isButtonCurrentlyHidden) {
      hideButton();
    }
  };

  const handleScrollEnd = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      showButton();
      scrollTimeout.current = null;
    }, 300);
  };

  const animatedButtonStyles = {
    transform: [{ translateX: buttonTranslateX }],
  };

  const renderUserActivities = () => {
    if (userActivities.length === 0) {
      return <Text>You don&#39;t have any current activities</Text>;
    }

    return userActivities.map((activity) => (
      <ActivityCard isCurrentUserActivity={true} key={activity.id} activityData={activity} />
    ));
  };

  return (
    <View style={styles.container}>
      <AppModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Add Activity"
      >
        <AddActivityForm onSubmitCallback={addActivityCallback} />
      </AppModal>
      <ScrollView
        style={styles.scrollViewContent}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: headerHeight }}
        scrollEventThrottle={16}
      >
        <TabMenu
          activeTab={activeTab}
          handleActiveTabPress={(tab) => setActiveTab(tab)}
          tabGroups={[TAB_ENUM.ALL, TAB_ENUM.MY_ACTIVITIES]}
        />

        {activeTab === TAB_ENUM.ALL && <>{renderActivities()}</>}
        {activeTab === TAB_ENUM.MY_ACTIVITIES && <>{renderUserActivities()}</>}
      </ScrollView>

      <Animated.View
        style={[
          styles.stickyButtonWrapper,
          { bottom: insets.bottom + 60, right: 20 },
          animatedButtonStyles,
        ]}
      >
        <Pressable onPress={handleStickyPress}>
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
      </Animated.View>
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

  stickyButtonWrapper: {
    position: 'absolute',
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
