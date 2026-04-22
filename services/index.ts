import { MovieDBService } from '@/services/MovieDBService';
import { ActivityService } from '@/services/ActivityService';
import { TavilyService } from '@/services/TavilyService';

export const movieDB = new MovieDBService();
export const activityService = new ActivityService();
export const tavilyService = new TavilyService();
