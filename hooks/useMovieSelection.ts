import { MappedMovie } from '@/types';
import { MAX_MOVIES_SELECTION } from '@/constants';
import { useState } from 'react';

interface UseMovieSelectionOptions {
  existingCount?: number;
  maxSelection?: number;
}

export const useMovieSelection = (options?: UseMovieSelectionOptions) => {
  const { existingCount = 0, maxSelection = MAX_MOVIES_SELECTION } = options || {};
  const [selectedMovies, setSelectedMovies] = useState<MappedMovie[]>([]);

  const handleMovieSelection = (movie: MappedMovie, callback?: () => void) => {
    const isAlreadySelected = selectedMovies.some((selected) => selected.id === movie.id);

    if (isAlreadySelected) {
      setSelectedMovies((prev) => prev.filter((selected) => selected.id !== movie.id));
    } else {
      const totalCount = existingCount + selectedMovies.length;
      if (totalCount < maxSelection) {
        setSelectedMovies((prev) => [...prev, movie]);
      } else {
        callback && callback();
      }
    }
  };

  const clearSelection = () => setSelectedMovies([]);

  return {
    handleMovieSelection,
    selectedMovies,
    clearSelection,
  };
};
