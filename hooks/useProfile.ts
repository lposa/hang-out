import { TABLE_ENUM } from '@/constants';
import { supabase } from '@/services/Supabase';
import { MappedMovie, Profile } from '@/types';
import { useEffect, useState } from 'react';

export type ProfileTopTenMoviesRow = {
  top_ten_movies: MappedMovie[];
};

type ProfileDataType = '*' | 'top_ten_movies';

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

  const getUserDataById = async (
    userId: string,
    dataType: ProfileDataType = '*'
  ): Promise<ProfileTopTenMoviesRow | Profile | undefined> => {
    if (!userId) {
      console.error('No user id is provided');
      return;
    }

    try {
      const { data, error } = await supabase
        .from(TABLE_ENUM.PROFILES)
        .select(dataType)
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
    getUserDataById,
  };
};
