import { Alert, Pressable, TextInput, View } from 'react-native';
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
  topTenMovies: MappedMovie[] | undefined;
  topTenBooks: string[] | undefined;
  topTenShows: string[] | undefined;
};

const DEBOUNCE_MS = 500;

const MAX_MOVIES_SELECTION = 10;

export const ProfileForm = () => {
  const [movies, setMovies] = useState<string>('');
  const [movieResults, setMovieResults] = useState<MappedMovie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<MappedMovie[]>([]);
  const debounceRef = useRef<number | null>(null);

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
      topTenMovies: [],
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

  useEffect(() => {
    setValue('topTenMovies', selectedMovies);
  }, [selectedMovies, setValue]);

  const handleMovieSearch = (movieName: string) => {
    setMovies(movieName);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (movieName.trim().length === 0) {
        return;
      }

      const movies = await movieDB.getMoviesByName(movieName);

      if (!movies || movies.results.length === 0) {
        console.error('No movies found');
        return;
      }

      const mappedMovies = mapMovieList(movies.results);

      setMovieResults(mappedMovies);
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

  return (
    <View style={styles.profileFormContainer}>
      <FormInput control={control} name="firstName" placeholder="First name" />
      <FormInput control={control} name="lastName" placeholder="Last name" />

      <View>
        <TextInput
          placeholder="Search movies..."
          style={styles.input}
          value={movies}
          // Pass the text directly to your handler
          onChangeText={handleMovieSearch}
        />

        <HorizontalList
          data={movieResults}
          renderItem={({ item: movie }) => (
            <Pressable onPress={() => handleMovieSelection(movie)}>
              <MovieDetails
                movie={movie}
                isRow={false}
                shouldShowOverview={false}
                shouldShowTitle
                customContainerStyle={[
                  styles.customMovieDetailsContainer,
                  selectedMovies.some((selected) => selected.id === movie.id) &&
                    styles.selectedSearchResultOutline,
                ]}
              />
            </Pressable>
          )}
          keyExtractor={(movie) => movie.id.toString()}
        />
      </View>
    </View>
  );
};
