import { supabase } from '@/services/Supabase';
import { analyzeMatch } from '@/ai';
import { ProfileTopTenMoviesRow, useProfile } from '@/hooks/useProfile';
import { useEffect, useState } from 'react';
import { TABLE_ENUM } from '@/constants';

interface IUseCalculateUserMatch {
  userId: string;
  category?: 'movies' | 'books' | 'tv_shows';
}

export const useCalculateUserMatch = ({ userId, category = 'movies' }: IUseCalculateUserMatch) => {
  const { getTopTenMovies, getUserDataById } = useProfile();

  const [matchScore, setMatchScore] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingMatch();
  }, [userId, category]);

  const checkExistingMatch = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from(TABLE_ENUM.COMPATIBILITY_MATCHES)
      .select('score')
      .eq('user_id', user.id)
      .eq('target_user_id', userId)
      .eq('category', category)
      .single();

    if (data) {
      setMatchScore(data.score);
    }
  };

  const calculateUserMatch = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let aiResult = null;

      if (category === 'movies') {
        const [currentUserMovies, activityPosterMovies] = await Promise.all([
          getTopTenMovies(),
          getUserDataById(userId, 'top_ten_movies'),
        ]);

        if (!currentUserMovies || !activityPosterMovies) return;

        const { result } = await analyzeMatch(
          currentUserMovies,
          activityPosterMovies as ProfileTopTenMoviesRow
        );
        aiResult = result;
      }
      //TODO: add more categories when needed
      // else if (category === 'books') { ... call analyzeBookMatch ... }

      if (aiResult) {
        setMatchScore(aiResult.compatibility_score);

        const matchData = {
          user_id: user.id,
          target_user_id: userId,
          category: category,
          score: aiResult.compatibility_score,
          shared_items: aiResult.shared_movies,
          shared_tags: aiResult.shared_genres,
          notes: aiResult.notes,
          updated_at: new Date(),
        };

        const { error: dbError } = await supabase
          .from('compatibility_matches')
          .upsert(matchData, { onConflict: 'user_id, target_user_id, category' });

        if (dbError) console.error('Error saving match:', dbError);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    calculateUserMatch,
    checkExistingMatch,
    matchScore,
  };
};
