import { TMDBMovieDetailsResponse, TMDBMovieSearchResponse } from '@/types';

const BASE_URL = 'https://api.themoviedb.org/3/';
const GET_MOVIE_DETAILS = `${BASE_URL}movie/`;

export class MovieDBService {
  async getMoviesByName(movieName: string): Promise<TMDBMovieSearchResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}search/movie?query=${movieName}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_DB_API_ACCESS_TOKEN}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.error('TMDB API Error (getMoviesByName):', response.status, errorText);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getNowPlaying(): Promise<TMDBMovieSearchResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}movie/now_playing`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_DB_API_ACCESS_TOKEN}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.error('TMDB API Error (getNowPlaying):', response.status, errorText);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getUpcomingMovies(): Promise<TMDBMovieSearchResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}movie/upcoming`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_DB_API_ACCESS_TOKEN}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.error('TMDB API Error (getUpcomingMovies):', response.status, errorText);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getNowPlayingAndUpcoming(): Promise<TMDBMovieSearchResponse | null> {
    try {
      const [nowPlaying, upcoming] = await Promise.all([
        this.getNowPlaying(),
        this.getUpcomingMovies(),
      ]);

      if (!nowPlaying && !upcoming) return null;

      const merged = [...(nowPlaying?.results ?? []), ...(upcoming?.results ?? [])];

      const deduped = Array.from(new Map(merged.map((movie) => [movie.id, movie])).values());

      return {
        page: 1,
        results: deduped,
        total_pages: 1,
        total_results: deduped.length,
      };
    } catch (error) {
      console.error('TMDB API Error (getNowPlayingAndUpcoming):', error);
      return null;
    }
  }

  async getMovieById(id: number): Promise<TMDBMovieDetailsResponse | null> {
    try {
      if (!id) {
        throw new Error('Movie ID is not provided');
      }

      const response = await fetch(`${GET_MOVIE_DETAILS}${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_DB_API_ACCESS_TOKEN}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
