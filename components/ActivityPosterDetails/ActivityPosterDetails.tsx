import { Pressable, Text, View } from 'react-native';
import { styles } from './ActivityPosterDetails.styles';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { useCalculateUserMatch, useProfile } from '@/hooks';
import { useState, useEffect } from 'react';
import { analyzeMatch } from '@/ai';
import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';
import { ProfileTopTenMoviesRow } from '@/hooks/useProfile';
import { UserMatchBar } from '@/components/UserMatchBar';

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
  const { loading, calculateUserMatch, matchScore } = useCalculateUserMatch({
    userId,
    category,
  });

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

      <UserMatchBar
        matchScore={matchScore}
        calculateUserMatch={calculateUserMatch}
        loading={loading}
        externalStyles={{ backgroundColor: '#E5F0FF' }}
      />
    </View>
  );
};
