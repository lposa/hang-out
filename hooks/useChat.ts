import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/services/Supabase';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { TABLE_ENUM } from '@/constants';

export interface IUseChatProps {
  activityId: string;
}

interface IMessageDB {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export const useChat = ({ activityId }: IUseChatProps) => {
  const [messages, setMessages] = useState<IMessage[] | []>([]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user', error);
        return;
      }

      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!activityId) {
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from(TABLE_ENUM.MESSAGES)
        .select(
          `
          id,
          text,
          created_at,
          user_id,
          user:profiles(id, first_name, last_name)
        `
        )
        .eq('activity_id', activityId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages', error);
        return;
      }

      if (!error && data) {
        const typedData = data as unknown as IMessageDB[];

        const formattedMessages: IMessage[] = typedData.map((msg: IMessageDB) => ({
          _id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.created_at),
          user: {
            _id: msg.user_id,
            name: `${msg.user?.first_name || ''} ${msg.user?.last_name || ''}`.trim() || 'User',
            avatar: require('@/assets/images/leonard_posa.jpeg'),
          },
        }));
        setMessages(formattedMessages);
      }
      setIsLoading(false);
    };

    fetchMessages();

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
          if (payload.new.user_id === currentUserId) {
            return;
          }
          const { data: senderProfile } = await supabase
            .from(TABLE_ENUM.PROFILES)
            .select('first_name, last_name')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: IMessage = {
            _id: payload.new.id,
            text: payload.new.text,
            createdAt: new Date(payload.new.created_at),
            user: {
              _id: payload.new.user_id,
              name:
                `${senderProfile?.first_name || ''} ${senderProfile?.last_name || ''}`.trim() ||
                'User',
              avatar: require('@/assets/images/leonard_posa.jpeg'),
            },
          };

          setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activityId, currentUserId]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

      const messageToSend = newMessages[0];

      if (!currentUserId || !activityId) {
        return;
      }

      const { error } = await supabase.from(TABLE_ENUM.MESSAGES).insert({
        activity_id: activityId,
        user_id: currentUserId,
        text: messageToSend.text,
      });

      if (error) {
        console.error('Error sending message', error);
      }
    },
    [activityId, currentUserId]
  );

  return { messages, isLoading, onSend, currentUserId };
};
