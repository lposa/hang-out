import { useEffect, useState } from 'react';
import { movieDB } from '@/services';
import { MappedMovie } from '@/types';
import { mapMovie } from '@/helpers';

export const useMovieDb = ({ movieName }: { movieName: string | undefined }) => {
  const [movie, setMovie] = useState<MappedMovie | null>(null);

  const getMovie = async () => {
    if (!movieName) {
      console.error('No movie name is provided');
      return null;
    }

    const movies = await movieDB.getMoviesByName(movieName);
    if (movies) {
      const foundMovie = movies.results.find((movie) => movie.title === movieName);

      if (foundMovie) {
        const mappedMovie = mapMovie(foundMovie);
        setMovie(mappedMovie);
        return foundMovie.id;
      } else {
        console.error("Couldn't find movie name");
        return null;
      }
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  return {
    movie,
  };
};
