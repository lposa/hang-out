import { MappedMovie, Movie, TMDBMovieDetailsResponse } from '@/types';

export const getMoviePoster = (
  moviePosterPath: string | null,
  size: 'w500' | 'original' = 'original'
) => {
  if (!moviePosterPath) {
    return '';
  }

  return `https://image.tmdb.org/t/p/${size}${moviePosterPath}`;
};

export const mapMovie = (movie: Movie): MappedMovie => {
  return {
    id: movie?.id,
    title: movie?.title,
    image: getMoviePoster(movie?.poster_path),
    overview: movie?.overview,
    releaseDate: movie?.release_date,
  };
};

export const mapMovieList = (movies: Movie[]): MappedMovie[] => movies.map(mapMovie);

export const mapMovieDetails = (movie: TMDBMovieDetailsResponse): MappedMovie => {
  return {
    id: movie?.id,
    title: movie?.title,
    image: getMoviePoster(movie?.poster_path),
    overview: movie?.overview,
    genre: movie?.genres.map((genre) => genre.name),
    releaseDate: movie?.release_date,
    runtime: movie?.runtime,
    review: movie?.vote_average.toFixed(1),
  };
};
