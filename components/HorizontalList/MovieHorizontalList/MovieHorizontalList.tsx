import { View, useWindowDimensions, Pressable } from 'react-native';
import { MappedMovie } from '@/types';
import { HorizontalList } from '../HorizontalList';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './MovieHorizontalList.styles';

interface IMovieHorizontalListProps {
  data: MappedMovie[];
  onDelete?: (movie: MappedMovie) => void;
  showDelete?: boolean;
}

export const MovieHorizontalList = ({
  data,
  onDelete,
  showDelete = false,
}: IMovieHorizontalListProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const snapInterval = cardWidth + 12;

  return (
    <HorizontalList
      data={data}
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
          {showDelete && onDelete && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => onDelete(movie)}
            >
              <MaterialIcons name="delete" size={20} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      )}
      keyExtractor={(movie) => movie.id.toString()}
      snapToInterval={snapInterval}
    />
  );
};
