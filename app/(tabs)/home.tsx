import { ScrollView, StyleSheet } from 'react-native';

import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { LinearGradient } from 'expo-linear-gradient';

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
  return (
    <LinearGradient colors={['#82D0EE', '#3AAAD9']} start={[0, 0]} end={[1, 0]} style={{ flex: 1 }}>
      <ScrollView style={styles.scrollViewContent}>
        <ActivityCard {...MOCK_ACTIVITY} />
        <ActivityCard {...MOCK_ACTIVITY_2} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 50,
    flex: 1,
  },
});
