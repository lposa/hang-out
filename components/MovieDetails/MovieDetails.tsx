import { View, Image, Text, StyleProp, ViewStyle } from 'react-native';
import { styles } from './MovieDetails.styles';
import { MappedMovie } from '@/types';
import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';

interface IMovieDetailsProps {
  movie: MappedMovie | undefined | null;
  isRow?: boolean;
  shouldShowOverview?: boolean;
  shouldShowTitle?: boolean;
  customContainerStyle?: StyleProp<ViewStyle>;
}

export const MovieDetails = ({
  movie,
  isRow = true,
  shouldShowOverview = true,
  shouldShowTitle = false,
  customContainerStyle,
}: IMovieDetailsProps) => {
  if (!movie) {
    return null;
  }

  const imageSource = movie?.image ? { uri: movie.image } : PLACEHOLDER_IMAGE;

  return (
    <View
      style={[
        styles.movieDetailsContainer,
        isRow && { flexDirection: 'row' },
        customContainerStyle,
      ]}
    >
      <Image source={imageSource} style={styles.movieDetailsPoster} resizeMode="cover" />
      {shouldShowTitle && <Text style={styles.movieTitle}>{movie.title}</Text>}
      {shouldShowOverview && (
        <View style={styles.movieDetailsTextContainer}>
          <Text style={styles.movieDetailsOverview}>{movie.overview}</Text>
        </View>
      )}
    </View>
  );
};
