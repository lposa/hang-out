import {
  Bubble,
  BubbleProps,
  Day,
  DayProps,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
  Avatar,
  AvatarProps,
} from 'react-native-gifted-chat';
import { Insets, KeyboardAvoidingView, Platform, StyleSheet, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export const renderBubble = (props: BubbleProps<IMessage>) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#6366F1',
          marginBottom: 4,
          marginRight: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 18,
          borderBottomRightRadius: 4,
        },
        left: {
          backgroundColor: '#FFFFFF',
          marginBottom: 4,
          marginLeft: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 18,
          borderBottomLeftRadius: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
      }}
      textStyle={{
        right: {
          color: '#FFFFFF',
          fontSize: 15,
          lineHeight: 20,
        },
        left: {
          color: '#111827',
          fontSize: 15,
          lineHeight: 20,
        },
      }}
    />
  );
};

export const renderInputToolbar = (props: InputToolbarProps<IMessage>, insets: Insets) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <InputToolbar
        {...props}
        containerStyle={[
          styles.inputToolbar,
          !!insets.bottom && { paddingBottom: insets.bottom + 8 },
        ]}
        primaryStyle={styles.inputPrimary}
      />
    </KeyboardAvoidingView>
  );
};

export const renderSend = (props: SendProps<IMessage>) => {
  return (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={20} color="#FFFFFF" />
      </View>
    </Send>
  );
};

export const renderDay = (props: DayProps) => {
  return <Day {...props} wrapperStyle={styles.dayWrapper} />;
};

export const renderAvatar = (props: AvatarProps<IMessage>) => {
  const placeholderAvatar = require('@/assets/images/leonard_posa.jpeg');
  const avatarSource = props.currentMessage?.user?.avatar || placeholderAvatar;
  
  if (!props.currentMessage) {
    return null;
  }

  return (
    <Avatar
      {...props}
      currentMessage={{
        ...props.currentMessage,
        user: {
          ...props.currentMessage.user,
          avatar: avatarSource,
        },
      }}
      imageStyle={{
        left: styles.avatarLeft,
        right: styles.avatarRight,
      }}
      containerStyle={{
        left: styles.avatarContainerLeft,
        right: styles.avatarContainerRight,
      }}
    />
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    marginRight: 8,
    maxHeight: 100,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayWrapper: {
    backgroundColor: 'rgba(99, 102, 241, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8,
  },
  dayText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarLeft: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarRight: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarContainerLeft: {
    marginRight: 8,
    marginBottom: 4,
  },
  avatarContainerRight: {
    marginLeft: 8,
    marginBottom: 4,
  },
});
