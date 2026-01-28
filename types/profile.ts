import { MappedMovie } from '@/types/movies';

export type Profile = {
  first_name: string;
  last_name: string;
  birthday: string;
  top_ten_movies: MappedMovie[] | undefined;
  image: string;
};
