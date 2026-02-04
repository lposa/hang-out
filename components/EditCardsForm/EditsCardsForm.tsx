import { Pressable, View, Text } from 'react-native';
import { MappedMovie } from '@/types';
import { MovieHorizontalList } from '@/components/HorizontalList/MovieHorizontalList';
import { TAB_ENUM, TABLE_ENUM } from '@/constants';
import { supabase } from '@/services/Supabase';
import { useState } from 'react';
import { styles } from './EditCardsForm.styles';
import { useToast } from '@/context/ToastContext';
import { MovieSearch } from '@/components/Search';
import { useMovieSelection } from '@/hooks/useMovieSelection';
import { GradientButton } from '@/components/elements';
import { TabMenu } from '@/components/TabMenu';

interface IEditCardsFormProps {
  data: MappedMovie[];
  userId: string;
  onDone: () => void;
}

export const EditCardsForm = ({ data, userId, onDone }: IEditCardsFormProps) => {
  const [movies, setMovies] = useState<MappedMovie[]>(data);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TAB_ENUM>(TAB_ENUM.EDIT);
  const [isLoading, setIsLoading] = useState(false);

  const { handleMovieSelection, selectedMovies, clearSelection } = useMovieSelection({
    existingCount: movies.length,
    maxSelection: 10,
  });

  const handleDelete = async (movieId: number) => {
    if (!userId) {
      showToast('No user logged in', 'error');
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
      showToast(error.message || 'Failed to delete movie', 'error');
    } else {
      showToast('Movie removed successfully', 'success');
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      showToast('No user logged in', 'error');
      return;
    }

    setIsLoading(true);

    const mergedMovies = [...movies];

    selectedMovies.forEach((movie) => {
      const exists = mergedMovies.some((m) => m.id === movie.id);
      if (!exists && mergedMovies.length < 10) {
        mergedMovies.push(movie);
      }
    });

    const { error } = await supabase
      .from(TABLE_ENUM.PROFILES)
      .update({ top_ten_movies: mergedMovies })
      .eq('id', userId);

    if (error) {
      showToast(error.message || 'Failed to update movies', 'error');
      return;
    }

    setMovies(mergedMovies);
    clearSelection();
    setActiveTab(TAB_ENUM.EDIT);
    showToast('Top 10 movies updated', 'success');
    setIsLoading(false);
  };

  return (
    <View style={styles.formContainer}>
      <TabMenu
        activeTab={activeTab}
        handleActiveTabPress={(tab) => setActiveTab(tab)}
        tabGroups={[TAB_ENUM.EDIT, TAB_ENUM.SEARCH]}
      />

      {activeTab === TAB_ENUM.SEARCH && (
        <MovieSearch
          selectedMovies={selectedMovies}
          onMovieSelect={handleMovieSelection}
          onClearSelection={clearSelection}
          existingMoviesCount={movies.length}
          maxSelection={10}
        />
      )}

      {(activeTab === TAB_ENUM.EDIT ||
        (activeTab === TAB_ENUM.SEARCH && selectedMovies.length > 0)) && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{movies.length + selectedMovies.length} / 10</Text>
        </View>
      )}

      {activeTab === TAB_ENUM.EDIT && (
        <MovieHorizontalList data={movies} showDelete={true} onDelete={handleDelete} />
      )}

      {activeTab === TAB_ENUM.SEARCH && (
        <GradientButton
          text="Save profile"
          onPress={handleSubmit}
          disabled={isLoading || !(selectedMovies.length > 0)}
          loading={isLoading}
        />
      )}
      <Pressable onPress={onDone} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
};
