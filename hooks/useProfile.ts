import { useEffect, useState } from 'react';
import { Profile } from '@/types';
import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';

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

  return {
    profileLoading: loading,
    profile,
  };
};
