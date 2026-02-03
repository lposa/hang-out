import { useSearch } from '@/hooks';
import { Pressable, Text, TextInput, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { HorizontalList } from '@/components/HorizontalList';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { MaterialIcons } from '@expo/vector-icons';
import { MappedMovie } from '@/types';
import { styles } from './MovieSearch.styles';

interface IMovieSearchProps {
  selectedMovies: MappedMovie[];
  onMovieSelect: (movie: MappedMovie) => void;
  onClearSelection?: () => void;
  maxSelection?: number;
  existingMoviesCount?: number;
  showCounter?: boolean;
  showClearButton?: boolean;
  placeholder?: string;
}

export const MovieSearch = ({
  selectedMovies,
  onMovieSelect,
  onClearSelection,
  maxSelection = 10,
  existingMoviesCount = 0,
  showCounter = true,
  showClearButton = true,
  placeholder = 'Search movies...',
}: IMovieSearchProps) => {
  const { movies, movieResults, handleMovieSearch } = useSearch();

  const totalSelected = existingMoviesCount + selectedMovies.length;

  const handleMovieClick = (movie: MappedMovie) => {
    onMovieSelect(movie);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        value={movies}
        onChangeText={handleMovieSearch}
      />

      {movieResults.length > 0 && (
        <View style={styles.selectionContainer}>
          {showCounter && (
            <View style={styles.selectionItemWrapper}>
              <BlurView style={styles.selectionItem} tint="dark" intensity={80}>
                <Text style={styles.selectionText}>
                  {totalSelected}/{maxSelection}
                </Text>
              </BlurView>
            </View>
          )}

          {showClearButton && onClearSelection && (
            <Pressable onPress={onClearSelection}>
              <View style={styles.selectionItemWrapper}>
                <BlurView tint="dark" style={styles.selectionItem} intensity={80}>
                  <Text style={styles.selectionText}>Clear selection</Text>
                </BlurView>
              </View>
            </Pressable>
          )}
        </View>
      )}

      <HorizontalList
        data={movieResults}
        renderItem={({ item: movie }) => {
          const isSelected = selectedMovies.some((selected) => selected.id === movie.id);
          return (
            <Pressable onPress={() => handleMovieClick(movie)}>
              <View style={styles.movieWrapper}>
                <MovieDetails
                  movie={movie}
                  isRow={false}
                  shouldShowOverview={false}
                  shouldShowTitle
                  customContainerStyle={[
                    styles.customMovieDetailsContainer,
                    isSelected && styles.selectedSearchResultOutline,
                  ]}
                  customImageStyle={styles.customMovieImage}
                />
                {isSelected && (
                  <View style={styles.checkmarkOverlay}>
                    <View style={styles.checkmarkCircle}>
                      <MaterialIcons name="check" size={24} color="#FFFFFF" />
                    </View>
                  </View>
                )}
              </View>
            </Pressable>
          );
        }}
        keyExtractor={(movie) => movie.id.toString()}
      />
    </View>
  );
};
