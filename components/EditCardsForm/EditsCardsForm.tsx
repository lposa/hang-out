import { Alert, Pressable, View, Text } from 'react-native';
import { MappedMovie } from '@/types';
import { MovieHorizontalList } from '@/components/HorizontalList/MovieHorizontalList';
import { TABLE_ENUM } from '@/constants';
import { supabase } from '@/services/Supabase';
import { useState } from 'react';
import { styles } from './EditCardsForm.styles';

interface IEditCardsFormProps {
  data: MappedMovie[];
  userId: string;
  onDone: () => void;
}

export const EditCardsForm = ({ data, userId, onDone }: IEditCardsFormProps) => {
  const [movies, setMovies] = useState<MappedMovie[]>(data);

  const handleDelete = async (movieId: number) => {
    if (!userId) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    const updated = movies.filter((m) => m.id !== movieId);
    setMovies(updated);

    const { error } = await supabase
      .from(TABLE_ENUM.PROFILES)
      .update({ top_ten_movies: updated })
      .eq('id', userId);

    if (error) {
      setMovies(movies);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{movies.length} / 10 movies selected</Text>
      </View>
      <MovieHorizontalList data={movies} showDelete={true} onDelete={handleDelete} />
      <Pressable onPress={onDone} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Done</Text>
      </Pressable>
    </View>
  );
};
