import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';
import { MappedMovie } from '@/types'; // Assuming MappedMovie includes properties like releaseDate, runtime, genre (array of Genre objects)
import { Image, StyleProp, Text, View, ViewStyle, StyleSheet } from 'react-native'; // Import StyleSheet
import { styles } from './MovieDetails.styles';

interface IMovieDetailsProps {
  movie: MappedMovie | undefined | null;
  isRow?: boolean;
  shouldShowOverview?: boolean;
  shouldShowTitle?: boolean;
  customContainerStyle?: StyleProp<ViewStyle>;
  // If you added selection props in previous steps, include them here too
  isSelected?: boolean;
  onPress?: (movie: MappedMovie) => void;
}

export const MovieDetails = ({
  movie,
  isRow = true,
  shouldShowOverview = true,
  shouldShowTitle = false,
  customContainerStyle,
  isSelected = false, // Assume default not selected
  onPress, // Assume onPress handler from previous steps
}: IMovieDetailsProps) => {
  if (!movie) {
    return null;
  }

  const imageSource = movie?.image ? { uri: movie.image } : PLACEHOLDER_IMAGE;

  return (
    // Wrap with Pressable if selection is intended from this component
    // If selection is handled by a parent Pressable, keep it as View
    <View
      style={[
        styles.movieDetailsContainer,
        isRow && { flexDirection: 'row' },
        customContainerStyle,
        isSelected && localStyles.selectedMovieOutline, // Apply a visual cue if selected
      ]}
    >
      <Image source={imageSource} style={styles.movieDetailsPoster} resizeMode="cover" />

      {shouldShowTitle && (
        <Text style={styles.movieTitle} numberOfLines={2} ellipsizeMode="tail">
          {movie.title}
        </Text>
      )}

      {/* FIX 1: Conditional rendering for releaseDate */}
      {movie.releaseDate && <Text style={localStyles.detailText}>{movie.releaseDate}</Text>}

      {/* FIX 2: Conditional rendering for runtime - ensuring it's a number > 0 */}
      {typeof movie.runtime === 'number' && movie.runtime > 0 && (
        <Text style={localStyles.detailText}>{movie.runtime} min</Text>
      )}

      {/* FIX 3: Conditional rendering for genres - check array exists and has elements, map genre.name */}
      {movie.genre && movie.genre.length > 0 && (
        <View style={localStyles.genreContainer}>
          {movie.genre.map((genre, index) => (
            <Text key={genre.id || index} style={localStyles.genreText}>
              {genre.name}
              {/* Add a comma if it's not the last genre */}
              {index < movie.genre.length - 1 ? ', ' : ''}
            </Text>
          ))}
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

// Add these new styles, either here or in MovieDetails.styles.ts
const localStyles = StyleSheet.create({
  selectedMovieOutline: {
    borderColor: 'gold', // Example highlight color
    borderWidth: 2,
    borderRadius: 8,
  },
  detailText: {
    color: '#ccc', // Example color for details
    fontSize: 12,
    marginTop: 2,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  genreText: {
    color: '#ccc',
    fontSize: 12,
  },
});
