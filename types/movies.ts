export type MappedMovie = {
  id: number;
  title: string;
  image: string;
  overview: string;
  runtime?: number;
  genre?: string[];
  releaseDate?: string;
  review?: string;
};

export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IMovieDataDB {
  cinema_name: string;
  title: string;
  source_title: string;
  source_url: string;
  confidence: number;
  notes: string;
  date: string | null;
  day: string | null;
  times?: string[];
  schedule: {
    date: string | null;
    day: string | null;
    times: string[];
    premiere?: boolean;
  }[];
  premiere?: boolean;
  genre?: string | null;
  runtime?: string | null;
  description?: string | null;
  moviePoster?: string | null;
}

export interface TMDBMovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface TMDBMovieDetailsResponse {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: MovieCollection | null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
