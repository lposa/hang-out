import { Image, View, Text, ImageSourcePropType } from 'react-native';
import { styles } from './ProfileCard.styles';
import PLACEHOLDER_IMG from '@/assets/images/profile-placeholder.png';
import { BlurView } from 'expo-blur';
import { formatBirthday } from '@/helpers';

interface IProfileCard {
  name: string;
  birthday: string;
  imageSrc: string;
}

export const ProfileCard = ({ name, birthday, imageSrc }: IProfileCard) => {
  const source: ImageSourcePropType = imageSrc ? { uri: imageSrc } : PLACEHOLDER_IMG;

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={80} tint="light" style={styles.glassCard}>
        <View style={styles.row}>
          <Image source={source} style={styles.avatar} />
          <View style={styles.textColumn}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.birthday}>{formatBirthday(birthday)}</Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
};
