import { useEffect, useRef, useState } from 'react';
import { MappedMovie } from '@/types';
import { movieDB } from '@/services';
import { mapMovieDetails } from '@/helpers/movies';

const DEBOUNCE_MS = 500;

export const useSearch = () => {
  const [movies, setMovies] = useState<string>('');
  const [movieResults, setMovieResults] = useState<MappedMovie[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  return {
    movieResults,
    movies,
    handleMovieSearch,
  };
};
