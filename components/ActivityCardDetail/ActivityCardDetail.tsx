import { Animated, Dimensions, Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { ActivityPoster } from '@/components/ActivityCard/ActivityCard';
import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { styles } from './ActivityCardDetail.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface IActivityDetailProps {
  activityName?: string | undefined;
  activityPoster?: ActivityPoster | undefined;
  activityDescription?: string | undefined;
  activityType?: ACTIVITY_TYPES_ENUM | undefined;
  isVisible: boolean;
  onClose: () => void;
  extraInfo?: string;
}

export const ActivityCardDetail = ({
  isVisible,
  onClose,
  activityName,
  activityPoster,
  activityDescription,
  activityType,
  extraInfo,
}: IActivityDetailProps) => {
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedTranslateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(animatedTranslateY, {
          toValue: 0,
          damping: 15,
          stiffness: 100,
          mass: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedTranslateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }
  }, [isVisible, animatedOpacity, animatedTranslateY, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlay,
        { opacity: animatedOpacity, transform: [{ translateY: animatedTranslateY }] },
      ]}
    >
      <LinearGradient
        colors={['#FFC371', '#FF5F6D', '#D92550']}
        start={[0, 0]} // Gradient top to bottom for modal
        end={[0, 1]}
        style={styles.fullScreenGradient}
      >
        <Pressable style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close-circle" size={30} color="white" />
        </Pressable>

        <View style={styles.modalContent}>
          <Text style={styles.modalActivityName}>{activityName}</Text>
          <Text style={styles.modalActivityDescription}>{activityDescription}</Text>
          <Text style={styles.modalExtraInfo}>{extraInfo}</Text>

          <View style={styles.posterDetails}>
            <Image source={activityPoster?.profilePic} style={styles.modalProfilePic} />
            <View>
              <Text style={styles.modalPosterName}>{activityPoster?.name}</Text>
              <Text style={styles.modalScoreText}>★ {activityPoster?.reviewScore}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
