import { Alert, Pressable, TextInput, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormInput, GradientButton, DatePickerInput } from '@/components/elements';
import { SubmitHandler, useForm } from 'react-hook-form';
import { styles } from './ProfileForm.style';
import { movieDB } from '@/services';
import { useRef, useState, useEffect } from 'react';
import { MappedMovie } from '@/types';
import { HorizontalList } from '@/components/HorizontalList';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { mapMovieDetails } from '@/helpers/movies';
import { BlurView } from 'expo-blur';
import { PROFILE_INPUT_VALIDATION_RULES, TABLE_ENUM } from '@/constants';
import { supabase } from '@/services/Supabase';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  birthday: string;
  topTenMovies: MappedMovie[] | undefined;
  topTenBooks: string[] | undefined;
  topTenShows: string[] | undefined;
};

const DEBOUNCE_MS = 500;

const MAX_MOVIES_SELECTION = 10;

export const ProfileForm = () => {
  const [movies, setMovies] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [movieResults, setMovieResults] = useState<MappedMovie[]>([]);

  const [selectedMovies, setSelectedMovies] = useState<MappedMovie[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      birthday: '',
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

      const detailedMoviesPromises = movies.results.map(async (movie) => {
        const movieDetail = await movieDB.getMovieById(movie.id);
        if (movieDetail) {
          return mapMovieDetails(movieDetail);
        }
        return null;
      });

      const allMappedMovies = await Promise.all(detailedMoviesPromises);

      const validMappedMovies = allMappedMovies.filter(
        (movie): movie is MappedMovie => movie !== null
      );

      setMovieResults(validMappedMovies);
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

  const onSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const profileData = {
      id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birthday: formData.birthday ? formData.birthday.toString() : null,
      top_ten_movies: formData.topTenMovies,
      updated_at: new Date(),
    };

    const { error } = await supabase.from(TABLE_ENUM.PROFILES).upsert(profileData);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Profile updated!');
    }

    setIsSubmitting(false);
  };

  return (
    <View style={styles.profileFormContainer}>
      <Text style={styles.headerText}>Edit Profile</Text>
      <FormInput
        control={control}
        name="firstName"
        placeholder="First name"
        rules={PROFILE_INPUT_VALIDATION_RULES.firstName}
      />

      {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

      <FormInput
        control={control}
        name="lastName"
        placeholder="Last name"
        rules={PROFILE_INPUT_VALIDATION_RULES.lastName}
      />

      {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

      <DatePickerInput
        control={control}
        name="birthday"
        placeholder="Birthday"
        rules={PROFILE_INPUT_VALIDATION_RULES.birthday}
        maximumDate={new Date()}
      />

      {errors.birthday && <Text style={styles.errorText}>{errors.birthday.message}</Text>}

      <View>
        <TextInput
          placeholder="Search movies..."
          style={styles.input}
          value={movies}
          onChangeText={handleMovieSearch}
        ></TextInput>

        {movieResults.length > 0 && (
          <View style={styles.selectionContainer}>
            <View style={styles.selectionItemWrapper}>
              <BlurView style={styles.selectionItem} tint="dark" intensity={80}>
                <Text style={styles.selectionText}>
                  {selectedMovies.length}/{MAX_MOVIES_SELECTION}
                </Text>
              </BlurView>
            </View>

            <Pressable onPress={() => setSelectedMovies([])}>
              <View style={styles.selectionItemWrapper}>
                <BlurView tint="dark" style={styles.selectionItem} intensity={80}>
                  <Text style={styles.selectionText}>Clear selection</Text>
                </BlurView>
              </View>
            </Pressable>
          </View>
        )}
        <HorizontalList
          data={movieResults}
          renderItem={({ item: movie }) => {
            const isSelected = selectedMovies.some((selected) => selected.id === movie.id);
            return (
              <Pressable onPress={() => handleMovieSelection(movie)}>
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

      <GradientButton
        text="Save profile"
        disabled={!isValid}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </View>
  );
};
