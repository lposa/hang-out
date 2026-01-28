import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { styles } from './ProfileDisplay.style';
import { Profile } from '@/types';
import { ProfileCard } from '@/components/ProfileDisplay/ProfileCard/ProfileCard';
import { HorizontalList } from '@/components/HorizontalList';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { MaterialIcons } from '@expo/vector-icons';

interface IProfileDisplay {
  profile: Profile;
}

export const ProfileDisplay = ({ profile }: IProfileDisplay) => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const snapInterval = cardWidth + 12;

  return (
    <View style={styles.profileDisplayContainer}>
      <ProfileCard
        name={`${profile.first_name} ${profile.last_name}`}
        birthday={profile.birthday}
        imageSrc={profile.image}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top 10 Movies</Text>
            <Text style={styles.sectionSubtitle}>Based on your picks</Text>
          </View>
        </View>
        {profile.top_ten_movies && profile?.top_ten_movies.length > 0 && (
          <HorizontalList
            data={profile.top_ten_movies}
            renderItem={({ item: movie }) => (
              <View style={[styles.movieCard, { width: cardWidth }]}>
                <MovieDetails
                  movie={movie}
                  isRow={false}
                  shouldShowOverview={false}
                  shouldShowTitle
                  customContainerStyle={styles.movieCardContainer}
                  customImageStyle={styles.movieCardImage}
                />
              </View>
            )}
            keyExtractor={(movie) => movie.id.toString()}
            snapToInterval={snapInterval}
          />
        )}
      </View>
    </View>
  );
};
