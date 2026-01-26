import { Alert, Pressable, TextInput, View, Text, StyleSheet } from 'react-native'; // Added Text, StyleSheet
import { FormInput } from '@/components/elements';
import { useForm } from 'react-hook-form';
import { styles } from './ProfileForm.style';
import { movieDB } from '@/services';
import { useRef, useState, useEffect } from 'react';
import { mapMovieList } from '@/helpers';
import { MappedMovie } from '@/types';
import { HorizontalList } from '@/components/HorizontalList';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  topTenMovies: MappedMovie[]; // CHANGED: Now expects MappedMovie[]
  topTenBooks: string[] | undefined;
  topTenShows: string[] | undefined;
};

const DEBOUNCE_MS = 500;
const MAX_MOVIES_SELECTION = 10;

export const ProfileForm = () => {
  const [searchText, setSearchText] = useState<string>(''); // Renamed to avoid confusion with `movies` from API
  const [movieResults, setMovieResults] = useState<MappedMovie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<MappedMovie[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      topTenBooks: [],
      topTenMovies: [], // Initialize with an empty MappedMovie[]
      topTenShows: [],
    },
  });

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Sync selectedMovies state with react-hook-form's 'topTenMovies' field
  useEffect(() => {
    setValue('topTenMovies', selectedMovies, { shouldValidate: true }); // added shouldValidate
  }, [selectedMovies, setValue]);

  const handleMovieSearch = (query: string) => {
    // Renamed from movieName to query
    setSearchText(query); // Update the text input immediately

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query.trim().length === 0) {
        setMovieResults([]); // Clear results if search query is empty
        return;
      }

      try {
        const moviesData = await movieDB.getMoviesByName(query);

        if (!moviesData || moviesData.results.length === 0) {
          console.log('No movies found for query:', query);
          setMovieResults([]); // Clear results if no movies found
          return;
        }

        const mappedMovies = mapMovieList(moviesData.results);
        setMovieResults(mappedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovieResults([]); // Clear results on error
      }
    }, DEBOUNCE_MS);
  };

  const handleMovieSelection = (movie: MappedMovie) => {
    const isAlreadySelected = selectedMovies.some((selected) => selected.id === movie.id);

    if (isAlreadySelected) {
      setSelectedMovies((prev) => prev.filter((selected) => selected.id !== movie.id));
    } else {
      if (selectedMovies.length < MAX_MOVIES_SELECTION) {
        setSelectedMovies((prev) => [...prev, movie]);
      } else {
        Alert.alert(
          'Selection Limit Reached',
          `You can select a maximum of ${MAX_MOVIES_SELECTION} movies.`
        );
      }
    }
  };

  // Example onSubmit handler
  const onSubmit = (data: ProfileFormData) => {
    console.log('Form Submitted with:', data);
    Alert.alert(
      'Form Data',
      JSON.stringify(
        data.topTenMovies.map((m) => m.title),
        null,
        2
      )
    );
    // Here you would typically send data to your backend
  };

  return (
    <View style={styles.profileFormContainer}>
      <FormInput control={control} name="firstName" placeholder="First name" />
      <FormInput control={control} name="lastName" placeholder="Last name" />

      {/* Display Selected Movies */}
      <View style={localStyles.movieSelectionContainer}>
        <Text style={localStyles.sectionTitle}>
          Your Top {MAX_MOVIES_SELECTION} Movies ({selectedMovies.length}/{MAX_MOVIES_SELECTION})
        </Text>
        {selectedMovies.length > 0 ? (
          <HorizontalList
            data={selectedMovies}
            renderItem={({ item: movie }) => (
              <MovieDetails
                movie={movie}
                isRow={false}
                shouldShowOverview={false}
                shouldShowTitle
                isSelected={true} // Always show as selected
                onPress={handleMovieSelection} // Allow deselection from this list
                customContainerStyle={localStyles.selectedMovieItem}
              />
            )}
            keyExtractor={(movie) => `selected-${movie.id.toString()}`}
            contentContainerStyle={localStyles.selectedMoviesList}
          />
        ) : (
          <Text style={localStyles.noSelectionText}>
            Select up to {MAX_MOVIES_SELECTION} movies below.
          </Text>
        )}
      </View>

      <View style={localStyles.searchContainer}>
        <TextInput
          placeholder="Search movies..."
          style={styles.input} // Re-use your existing input style
          value={searchText}
          onChangeText={handleMovieSearch}
        />

        {movieResults.length > 0 &&
          searchText.length > 0 && ( // Only show results if there's a search term
            <HorizontalList
              data={movieResults}
              renderItem={({ item: movie }) => (
                <Pressable onPress={() => handleMovieSelection(movie)}>
                  <MovieDetails
                    movie={movie}
                    isRow={false}
                    shouldShowOverview={false}
                    shouldShowTitle
                    // Use .some() to check if this movie is currently in the selectedMovies array
                    isSelected={selectedMovies.some((selected) => selected.id === movie.id)}
                    // You don't need `onPress` here for visual feedback; the Pressable wrapper handles it
                    customContainerStyle={[
                      localStyles.searchResultItem, // Apply base style for search results
                      selectedMovies.some((selected) => selected.id === movie.id) &&
                        localStyles.selectedSearchResultOutline, // Apply selection outline
                    ]}
                  />
                </Pressable>
              )}
              keyExtractor={(movie) => `search-${movie.id.toString()}`}
              contentContainerStyle={localStyles.searchResultsList}
            />
          )}
        {searchText.length > 0 && movieResults.length === 0 && (
          <Text style={localStyles.noResultsText}>No movies found for "{searchText}".</Text>
        )}
      </View>

      <Pressable
        style={[localStyles.submitButton, !isValid && localStyles.disabledButton]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        <Text style={localStyles.submitButtonText}>Save Profile</Text>
      </Pressable>
    </View>
  );
};

// Add some local styles for clarity and selection visual feedback
const localStyles = StyleSheet.create({
  movieSelectionContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  selectedMoviesList: {
    // Custom padding/gap for the selected list if needed in HorizontalList
  },
  selectedMovieItem: {
    marginRight: 10, // Spacing between selected movies
    // Add any specific styles for selected items here, e.g., a subtle border
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
  },
  noSelectionText: {
    color: '#ccc',
    textAlign: 'center',
    padding: 10,
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchResultsList: {
    marginTop: 10,
  },
  searchResultItem: {
    marginRight: 10,
  },
  selectedSearchResultOutline: {
    // New style for selected search results
    borderColor: 'gold',
    borderWidth: 2,
  },
  noResultsText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
