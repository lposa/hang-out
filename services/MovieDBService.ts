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
