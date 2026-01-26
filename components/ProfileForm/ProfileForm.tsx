import { TextInput, View } from 'react-native';
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
  topTenMovies: string[] | undefined;
  topTenBooks: string[] | undefined;
  topTenShows: string[] | undefined;
};

const DEBOUNCE_MS = 500;

export const ProfileForm = () => {
  const [movies, setMovies] = useState<string>('');
  const [movieResults, setMovieResults] = useState<MappedMovie[]>([]);
  const debounceRef = useRef<number | null>(null);

  const {
    control,
    handleSubmit,
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
            <MovieDetails
              movie={movie}
              isRow={false}
              shouldShowOverview={false}
              shouldShowTitle
              customContainerStyle={styles.customMovieDetailsContainer}
            />
          )}
          keyExtractor={(movie) => movie.id.toString()}
        />
      </View>
    </View>
  );
};
