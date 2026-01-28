import { View, Text } from 'react-native';
import { styles } from './ProfileDisplay.style';
import { Profile } from '@/types';
import { ProfileCard } from '@/components/ProfileDisplay/ProfileCard/ProfileCard';
import { HorizontalList } from '@/components/HorizontalList';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { BlurView } from 'expo-blur';

interface IProfileDisplay {
  profile: Profile;
}

export const ProfileDisplay = ({ profile }: IProfileDisplay) => {
  return (
    <View style={styles.profileDisplayContainer}>
      <ProfileCard
        name={`${profile.first_name} ${profile.last_name}`}
        birthday={profile.birthday}
        imageSrc={profile.image}
      />

      <View style={styles.list}>
        <BlurView style={styles.listTextContainer} tint="dark">
          <Text style={styles.listText}>Top Ten Movies</Text>
        </BlurView>
        {profile.top_ten_movies && profile?.top_ten_movies.length > 0 && (
          <HorizontalList
            data={profile.top_ten_movies}
            renderItem={({ item: movie }) => (
              <MovieDetails movie={movie} shouldShowOverview={false} />
            )}
          />
        )}
      </View>
    </View>
  );
};
