import { Image, View, Text, ImageSourcePropType, Pressable } from 'react-native';
import { styles } from './ProfileCard.styles';
import PLACEHOLDER_IMG from '@/assets/images/profile-placeholder.png';
import { formatBirthday } from '@/helpers';

interface IProfileCard {
  name: string;
  birthday: string | null;
  imageSrc: string | undefined;
  onEdit?: () => void;
}

export const ProfileCard = ({ name, birthday, imageSrc, onEdit }: IProfileCard) => {
  const source: ImageSourcePropType = imageSrc ? { uri: imageSrc } : PLACEHOLDER_IMG;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatarContainer}>
            <Image source={source} style={styles.avatar} />
            <View style={styles.statusDot} />
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.birthday}>{formatBirthday(birthday)}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Level 5 • Movie Enthusiast</Text>
            </View>
          </View>
        </View>

        {onEdit && (
          <View style={styles.controlCenter}>
            <Pressable style={styles.controlButton} onPress={onEdit}>
              <Text>Update profile</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};
