import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';
import { MappedMovie } from '@/types';
import { Image, StyleProp, Text, View, ViewStyle } from 'react-native';
import { styles } from './MovieDetails.styles';
import { GenreTag } from '@/components/elements';
import { ImageStyle } from 'expo-image';

interface IMovieDetailsProps {
  movie: MappedMovie | undefined | null;
  isRow?: boolean;
  shouldShowOverview?: boolean;
  shouldShowTitle?: boolean;
  customContainerStyle?: StyleProp<ViewStyle>;
  customImageStyle?: StyleProp<ImageStyle>;
}

export const MovieDetails = ({
  movie,
  isRow = true,
  shouldShowOverview = true,
  shouldShowTitle = false,
  customContainerStyle,
  customImageStyle,
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
      <Image
        source={imageSource}
        style={[styles.movieDetailsPoster, customImageStyle]}
        resizeMode="cover"
      />
      {shouldShowTitle && (
        <Text style={styles.movieTitle} numberOfLines={2} ellipsizeMode="tail">
          {movie.title}
        </Text>
      )}
      <View style={styles.movieExtraDetails}>
        {movie.releaseDate && <Text>{movie.releaseDate.split('-')[0]}</Text>}
        {movie.runtime && <Text>{movie.runtime} min</Text>}
        <View style={styles.movieGenreContainer}>
          {movie.genre &&
            movie?.genre?.length > 0 &&
            movie.genre?.map((genre) => <GenreTag key={genre} text={genre} />)}
        </View>
      </View>
      {shouldShowOverview && (
        <View style={styles.movieDetailsTextContainer}>
          <Text style={styles.movieDetailsOverview}>{movie.overview}</Text>
        </View>
      )}
    </View>
  );
};
