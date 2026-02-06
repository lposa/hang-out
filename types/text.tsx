import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native'; // Import Dimensions
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
import { useEffect, useState, useRef } from 'react'; // Import useRef

// Reanimated imports
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Get screen width

export default function HomeScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TAB_ENUM>(TAB_ENUM.ALL);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);

  // Reanimated Shared Values
  const buttonTranslateX = useSharedValue(0); // 0 means fully visible, SCREEN_WIDTH means hidden
  const isButtonHidden = useSharedValue(false); // To prevent multiple hide/show animations

  const handleStickyPress = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const activities = await activityService.fetchAllActivities();
      setActivities(activities);
    };

    const fetchUserActivities = async () => {
      const userActivities = await activityService.fetchCurrentUserActivities();
      setUserActivities(userActivities);
    };

    fetchActivities();
    fetchUserActivities();
  }, []);

  const renderActivities = () => {
    if (activities.length === 0) {
      return <Text>No Activities Found</Text>;
    }

    return activities.map((activity) => <ActivityCard key={activity.id} activityData={activity} />);
  };

  const renderUserActivities = () => {
    if (userActivities.length === 0) {
      return <Text>You don&#39;t have any current activities</Text>;
    }

    return userActivities.map((activity) => (
      <ActivityCard isCurrentUserActivity={true} key={activity.id} activityData={activity} />
    ));
  };

  // --- Reanimated Logic ---

  // Function to show the button (run on JS thread)
  const showButton = () => {
    'worklet'; // Mark as worklet to run on UI thread
    if (isButtonHidden.value) {
      buttonTranslateX.value = withTiming(0, { duration: 200 });
      isButtonHidden.value = false;
    }
  };

  // Function to hide the button (run on JS thread)
  const hideButton = () => {
    'worklet'; // Mark as worklet to run on UI thread
    if (!isButtonHidden.value) {
      buttonTranslateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }); // Slide completely off screen
      isButtonHidden.value = true;
    }
  };

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const SCROLL_HIDE_THRESHOLD = 50; // How much scroll down before hiding

      // Hide if scrolling down past a threshold
      if (currentScrollY > SCROLL_HIDE_THRESHOLD && !isButtonHidden.value) {
        runOnJS(hideButton)();
      } else if (currentScrollY <= SCROLL_HIDE_THRESHOLD && isButtonHidden.value) {
        // Option to show when near the top again
        runOnJS(showButton)();
      }
    },
    // This fires when the user lifts their finger from scrolling
    onEndDrag: (event) => {
      // If momentum scrolling doesn't take over, we want to show the button
      // We'll primarily rely on onMomentumScrollEnd but this is a fallback
      runOnJS(showButton)();
    },
    // This fires when momentum scrolling has completely stopped
    onMomentumEnd: (event) => {
      runOnJS(showButton)();
    },
  });

  // Animated style for the button
  const animatedButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: buttonTranslateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <AppModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Add Activity"
      >
        <AddActivityForm onSubmitCallback={() => setIsModalVisible(false)} />
      </AppModal>
      <Animated.ScrollView // Use Animated.ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={{ paddingVertical: headerHeight }}
        onScroll={scrollHandler} // Attach the scroll handler
        scrollEventThrottle={16} // Important for smooth animation
      >
        <TabMenu
          activeTab={activeTab}
          handleActiveTabPress={(tab) => setActiveTab(tab)}
          tabGroups={[TAB_ENUM.ALL, TAB_ENUM.MY_ACTIVITIES]}
        />

        {activeTab === TAB_ENUM.ALL && <>{renderActivities()}</>}
        {activeTab === TAB_ENUM.MY_ACTIVITIES && <>{renderUserActivities()}</>}
      </Animated.ScrollView>

      {/* Wrap your Pressable in an Animated.View */}
      <Animated.View
        style={[
          styles.stickyButtonWrapper, // A new style to position it statically
          { bottom: insets.bottom + 20, right: 20 }, // Static position
          animatedButtonStyles, // Animated transform
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
  // New wrapper style for the Animated.View
  stickyButtonWrapper: {
    position: 'absolute', // Fixed position
    // No 'right' or 'bottom' here, they are passed dynamically
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
