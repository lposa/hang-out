import { MappedMovie } from '@/types/movies';

export type Profile = {
  id?: string;
  first_name: string;
  last_name: string;
  birthday: string | null;
  top_ten_movies?: MappedMovie[] | undefined;
  image?: string;
  updated_at?: Date;
};
