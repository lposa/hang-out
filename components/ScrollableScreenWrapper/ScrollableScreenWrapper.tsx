import React, { useEffect } from 'react';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScroll } from '@/context/ScrollContext';

const HEADER_CONTENT_HEIGHT = 64;

interface ScrollableScreenWrapperProps {
  children: React.ReactNode;
}

export const ScrollableScreenWrapper: React.FC<ScrollableScreenWrapperProps> = ({ children }) => {
  const { scrollY } = useScroll();
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop: HEADER_CONTENT_HEIGHT + insets.top }}
      style={styles.container}
    >
      {children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
