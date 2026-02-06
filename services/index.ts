import { MovieDBService } from '@/services/MovieDBService';
import { ActivityService } from '@/services/ActivityService';

export const movieDB = new MovieDBService();
export const activityService = new ActivityService();
