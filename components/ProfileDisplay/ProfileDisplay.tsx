import { Pressable, Text, View } from 'react-native';
import { styles } from './ProfileDisplay.style';
import { Profile } from '@/types';
import { ProfileCard } from '@/components/ProfileDisplay/ProfileCard/ProfileCard';
import { MovieHorizontalList } from '@/components/HorizontalList/MovieHorizontalList';
import { SCREEN_MODE_ENUM } from '@/app/(tabs)/profile';

interface IProfileDisplay {
  profile: Profile;
  onEdit: (screenMode: SCREEN_MODE_ENUM) => void;
}

export const ProfileDisplay = ({ profile, onEdit }: IProfileDisplay) => {
  return (
    <View style={styles.profileDisplayContainer}>
      <ProfileCard
        name={`${profile.first_name} ${profile.last_name}`}
        birthday={profile.birthday}
        imageSrc={profile.image}
        onEdit={() => onEdit(SCREEN_MODE_ENUM.EDIT)}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top 10 Movies</Text>
            <Text style={styles.sectionSubtitle}>Based on your picks</Text>
          </View>
          <View>
            <Pressable onPress={() => onEdit(SCREEN_MODE_ENUM.EDIT_PICK)} style={styles.editButton}>
              <Text>Edit picks</Text>
            </Pressable>
          </View>
        </View>
        {profile.top_ten_movies && profile.top_ten_movies.length > 0 && (
          <MovieHorizontalList data={profile.top_ten_movies} />
        )}
      </View>
    </View>
  );
};
