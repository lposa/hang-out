import { View, Text, useWindowDimensions, Pressable } from 'react-native';
import { styles } from './ProfileDisplay.style';
import { Profile } from '@/types';
import { ProfileCard } from '@/components/ProfileDisplay/ProfileCard/ProfileCard';
import { HorizontalList } from '@/components/HorizontalList';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';

interface IProfileDisplay {
  profile: Profile;
  onEdit: () => void;
}

export const ProfileDisplay = ({ profile, onEdit }: IProfileDisplay) => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const snapInterval = cardWidth + 12;

  return (
    <View style={styles.profileDisplayContainer}>
      <ProfileCard
        name={`${profile.first_name} ${profile.last_name}`}
        birthday={profile.birthday}
        imageSrc={profile.image}
        onEdit={onEdit}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top 10 Movies</Text>
            <Text style={styles.sectionSubtitle}>Based on your picks</Text>
          </View>
          <View>
            <Pressable onPress={onEdit} style={styles.editButton}>
              <Text>Edit picks</Text>
            </Pressable>
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
