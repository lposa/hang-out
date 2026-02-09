import { Pressable, Text, View } from 'react-native';
import { styles } from './ActivityPosterDetails.styles';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { useProfile } from '@/hooks';
import { useState, useEffect } from 'react';
import { analyzeMatch } from '@/ai';
import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';

interface IActivityPosterProps {
  name: string;
  reviewScore: number;
  userId: string;
  category?: 'movies' | 'books' | 'tv_shows';
}

const renderStars = (reviewScore: number) => {
  const filledStars = Math.floor(reviewScore);
  const hasHalfStar = reviewScore % 1 >= 0.5;

  return [...Array(5)].map((_, index) => {
    if (index < filledStars) {
      return <Ionicons key={index} name="star" size={18} color="#f5a623" />;
    }
    if (index === filledStars && hasHalfStar) {
      return <Ionicons key={index} name="star-half" size={18} color="#f5a623" />;
    }
    return <Ionicons key={index} name="star-outline" size={18} color="#999" />;
  });
};

export const ActivityPosterDetails = ({
  name,
  reviewScore,
  userId,
  category = 'movies',
}: IActivityPosterProps) => {
  const { getTopTenMovies, getUserById } = useProfile();
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
          getUserById(userId),
        ]);

        if (!currentUserMovies || !activityPosterMovies) return;

        const { result } = await analyzeMatch(currentUserMovies, activityPosterMovies);
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

  return (
    <View style={styles.activityPosterDetailsContainer}>
      <View style={styles.posterInfo}>
        <Text style={styles.posterName} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>{renderStars(reviewScore)}</View>
          <Text style={styles.reviewScoreText}>{reviewScore.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.matchContainer}>
        {matchScore !== undefined ? (
          <>
            <Text style={styles.matchScoreText}>Compatibility: {Math.floor(matchScore)}%</Text>
            <ProgressBar match={matchScore} />
          </>
        ) : (
          <Pressable
            style={[styles.calculateButton, loading && styles.calculateButtonDisabled]}
            onPress={calculateUserMatch}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.calculateButtonContent}>
                <LoaderSpinner size={14} color="#FFFFFF" />
                <Text style={styles.calculateButtonText}>Calculating...</Text>
              </View>
            ) : (
              <View style={styles.calculateButtonContent}>
                <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
                <Text style={styles.calculateButtonText}>Calculate match</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};
