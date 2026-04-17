import { MappedMovie } from '@/types/movies';
import { ACTIVITY_LIFECYCLE_STATUS_ENUM } from '@/constants';

export type Activity = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  activity_type: 'movie' | 'basketball';
  activity_data: MappedMovie | null;
  date: string;
  time: string;
  place: string;
  price: string;
  created_at: string;
  status?: ACTIVITY_LIFECYCLE_STATUS_ENUM;
};

export type MatchCategory = 'movies' | 'books' | 'tv_shows';

export interface CompatibilityMatch {
  id: string;
  user_id: string;
  target_user_id: string;
  category: MatchCategory;
  score: number;
  shared_items: string[];
  shared_tags: string[];
  notes: string;
  updated_at: string;
}
