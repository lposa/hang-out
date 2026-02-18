import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useHeaderHeight } from '@react-navigation/elements';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { renderBubble, renderDay, renderInputToolbar, renderSend } from '@/components/Chat';
import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';

export default function ChatScreen() {
  // 1. Get the activity ID from the route (e.g. pushed from ActivityCard)
  const { activityId } = useLocalSearchParams();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  // 2. Fetch the Current User (to know which messages are "mine")
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  // 3. Load Initial Messages & Subscribe to new ones
  useEffect(() => {
    if (!activityId) return;

    // A. Function to fetch old messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages') // Use 'messages' or TABLE_ENUM.MESSAGES
        .select(
          `
          id,
          text,
          created_at,
          user_id,
          user:profiles(id, first_name, last_name, avatar_url)
        `
        )
        .eq('activity_id', activityId)
        .order('created_at', { ascending: false }); // GiftedChat wants newest first (bottom to top)

      if (!error && data) {
        // Map Supabase data structure to GiftedChat IMessage structure
        const formattedMessages: IMessage[] = data.map((msg: any) => ({
          _id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.created_at),
          user: {
            _id: msg.user_id,
            name: msg.user?.first_name || 'User',
            avatar: msg.user?.avatar_url || require('@/assets/images/leonard_posa.jpeg'), // Fallback image
          },
        }));
        setMessages(formattedMessages);
      }
      setIsLoading(false);
    };

    fetchMessages();

    // B. Subscribe to NEW messages (Realtime)
    const channel = supabase
      .channel(`chat:${activityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `activity_id=eq.${activityId}`,
        },
        async (payload) => {
          // If I sent the message, GiftedChat's onSend already added it optimistically.
          // We can skip adding it again to prevent duplicates, OR handle ID updates.
          // For simplicity, we ignore our own realtime events here.
          // Note: payload.new usually only has raw data, not joined profile data.

          if (payload.new.user_id === currentUserId) return;

          // We need to fetch the sender's profile because Realtime payload doesn't include joins
          const { data: senderProfile } = await supabase
            .from('profiles') // or TABLE_ENUM.PROFILES
            .select('first_name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: IMessage = {
            _id: payload.new.id,
            text: payload.new.text,
            createdAt: new Date(payload.new.created_at),
            user: {
              _id: payload.new.user_id,
              name: senderProfile?.first_name || 'User',
              avatar: senderProfile?.avatar_url || require('@/assets/images/leonard_posa.jpeg'),
            },
          };

          setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
        }
      )
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activityId, currentUserId]);

  // 4. Handle Sending Messages
  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      // A. Update UI immediately (Optimistic UI)
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

      const messageToSend = newMessages[0];

      if (!currentUserId || !activityId) return;

      // B. Write to Database
      const { error } = await supabase.from('messages').insert({
        activity_id: activityId,
        user_id: currentUserId,
        text: messageToSend.text,
      });

      if (error) {
        console.error('Error sending message', error);
        // Optional: Show error toast or remove message from state
      }
    },
    [activityId, currentUserId]
  );

  // --- Render ---

  if (isLoading || !currentUserId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF5F6D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.headerSpacer} />
      </View>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUserId, // Important: Use the real Supabase User ID here
        }}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
        renderBubble={renderBubble}
        renderInputToolbar={(props) => renderInputToolbar(props, insets)}
        renderSend={renderSend}
        renderDay={renderDay}
        textInputProps={{ placeholder: 'Type a message' }}
        minInputToolbarHeight={60}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
});
