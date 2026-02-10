import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProfile } from '@/hooks';
import { useEffect, useState } from 'react';
import { Profile } from '@/types';
import { ProfileDisplay } from '@/components/ProfileDisplay';
import { TabMenu } from '@/components/TabMenu';
import { TAB_ENUM, TABLE_ENUM } from '@/constants';
import { useHeaderHeight } from '@react-navigation/elements';
import { supabase } from '@/services/Supabase';
import { AiAnalysisDisplay } from '@/components/AiAnalysisDisplay';

export interface IUserMatch {
  notes?: string;
  score?: number;
  shared_items?: string[];
  shared_tags?: string[];
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 120,
  },
  tabContent: {
    flexGrow: 1,
    backgroundColor: '#F9FBFF',
  },
  analysisPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  analysisPlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabMenuContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});

export default function ProfileScreen() {
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams();
  const { getUserDataById } = useProfile();

  const [userProfile, setUserProfile] = useState<Profile>();
  const [userMatch, setUserMatch] = useState<IUserMatch | null>(null);
  const [activeTab, setActiveTab] = useState<TAB_ENUM>(TAB_ENUM.PROFILE);

  useEffect(() => {
    const getProfileData = async () => {
      if (!id) return;
      const data = await getUserDataById(id as string);
      if (data) setUserProfile(data as Profile);
    };

    getProfileData();
  }, [id]);

  useEffect(() => {
    if (!userProfile?.id) {
      return;
    }

    const checkMatches = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data } = await supabase
        .from(TABLE_ENUM.COMPATIBILITY_MATCHES)
        .select('*')
        .eq('user_id', user.id)
        .eq('target_user_id', userProfile.id)
        .single();
      if (data) {
        setUserMatch({
          notes: data.notes,
          score: data.score,
          shared_items: data.shared_items,
          shared_tags: data.shared_tags,
        });
      }
    };

    checkMatches();
  }, [userProfile?.id]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
      <TabMenu
        activeTab={activeTab}
        handleActiveTabPress={setActiveTab}
        tabGroups={[TAB_ENUM.PROFILE, TAB_ENUM.AI_ANALYSIS]}
        customContainerStyle={styles.tabMenuContainer}
      />
      <View style={styles.tabContent}>
        {activeTab === TAB_ENUM.PROFILE && userProfile && <ProfileDisplay profile={userProfile} />}
        {activeTab === TAB_ENUM.AI_ANALYSIS && userMatch && <AiAnalysisDisplay {...userMatch} />}
      </View>
    </ScrollView>
  );
}
