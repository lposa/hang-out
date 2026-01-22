import { Movie } from '@/services/MovieDBService';
import { useEffect, useState } from 'react';
import { movieDB } from '@/services';

const MOVIE_NAME = 'Avengers: Doomsday';

export type MappedMovie = {
  id: number;
  title: string;
  image: string;
  overview: string;
};

const getMoviePoster = (moviePosterPath: string | null, size: 'w500' | 'original' = 'original') => {
  if (!moviePosterPath) {
    return '';
  }

  return `https://image.tmdb.org/t/p/${size}${moviePosterPath}`;
};

const mapMovie = (movie: Movie): MappedMovie => {
  return {
    id: movie?.id,
    title: movie?.title,
    image: getMoviePoster(movie?.poster_path),
    overview: movie?.overview,
  };
};

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
