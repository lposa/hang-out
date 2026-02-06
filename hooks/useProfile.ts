import { useEffect, useState } from 'react';
import { MappedMovie, Profile } from '@/types';
import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';

export type ProfileTopTenMoviesRow = {
  top_ten_movies: MappedMovie[];
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(false);

  const getProfileFromDB = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log('No user logged in');
        return;
      }

      const { data, error } = await supabase
        .from(TABLE_ENUM.PROFILES)
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileFromDB();
  }, []);

  const getTopTenMovies = async (): Promise<ProfileTopTenMoviesRow | undefined> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log('No user logged in');
        return;
      }

      const { data, error } = await supabase
        .from(TABLE_ENUM.PROFILES)
        .select('top_ten_movies')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        return data;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getUserById = async (userId: string): Promise<ProfileTopTenMoviesRow | undefined> => {
    if (!userId) {
      console.error('No user id is provided');
      return;
    }

    try {
      const { data, error } = await supabase
        .from(TABLE_ENUM.PROFILES)
        .select('top_ten_movies')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        return data;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return {
    profileLoading: loading,
    profile,
    refetch: getProfileFromDB,
    getTopTenMovies,
    getUserById,
  };
};
