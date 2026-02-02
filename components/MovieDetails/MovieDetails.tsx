import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';
import { MappedMovie } from '@/types';
import { ImageStyle } from 'expo-image';
import { Image, StyleProp, Text, View, ViewStyle } from 'react-native';
import { styles } from './MovieDetails.styles';
import { GenreTag } from '@/components/elements';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface IMovieDetailsProps {
  movie: MappedMovie | undefined | null;
  isRow?: boolean;
  shouldShowOverview?: boolean;
  shouldShowTitle?: boolean;
  customContainerStyle?: StyleProp<ViewStyle>;
  customImageStyle?: StyleProp<ImageStyle>;
  isEditMode?: boolean;
}

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const MovieDetails = ({
  movie,
  isRow = true,
  shouldShowOverview = true,
  shouldShowTitle = false,
  customContainerStyle,
  customImageStyle,
  isEditMode = false,
}: IMovieDetailsProps) => {
  if (!movie) {
    return null;
  }

  const imageSource = movie?.image ? { uri: movie.image } : PLACEHOLDER_IMAGE;
  const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : null;
  const runtime = formatRuntime(movie.runtime);
  const primaryGenre = movie.genre && movie.genre.length > 0 ? movie.genre[0] : null;

  return (
    <View
      style={[
        styles.movieDetailsContainer,
        isRow && { flexDirection: 'row' },
        customContainerStyle,
      ]}
    >
      {movie.review && parseFloat(movie.review) !== 0 && (
        <View style={[styles.reviewContainer, styles.imageBadge]}>
          <Ionicons name="star" size={14} color="#eab308" />
          <Text style={styles.reviewText}>{movie?.review}</Text>
        </View>
      )}

      {isEditMode && (
        <View style={[styles.removeIcon, styles.imageBadge]}>
          <MaterialIcons name="delete" size={24} color="#FFF" />
        </View>
      )}
      <Image
        source={imageSource}
        style={[styles.movieDetailsPoster, customImageStyle]}
        resizeMode="cover"
      />
      {shouldShowTitle && (
        <View style={styles.movieInfoSection}>
          <Text style={styles.movieTitle} numberOfLines={2} ellipsizeMode="tail">
            {movie.title}
          </Text>
          <View style={styles.movieMetadataRow}>
            {year && <Text style={styles.metadataText}>{year}</Text>}
            {runtime && (
              <>
                {year && <Text style={styles.metadataSeparator}> • </Text>}
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.metadataText}>{runtime}</Text>
              </>
            )}
            {primaryGenre && (
              <>
                {(year || runtime) && <Text style={styles.metadataSeparator}> • </Text>}
                <GenreTag text={primaryGenre} />
              </>
            )}
          </View>
        </View>
      )}
      {shouldShowOverview && (
        <View style={styles.movieDetailsTextContainer}>
          <Text style={styles.movieDetailsOverview}>{movie.overview}</Text>
        </View>
      )}
    </View>
  );
};
