import { TMDBMovieSearchResponse } from '@/types';

const BASE_URL = 'https://api.themoviedb.org/3/';

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

  async getMovieById(id: number): Promise<TMDBMovieSearchResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}movie/${id}`, {
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
