import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AcceptedRequests.style';
import {
  PARTICIPANT_STATUS_ENUM,
  IPendingActivityParticipant,
} from '@/components/ActivityCard/types';
import { Href, router } from 'expo-router';
import { AppModal } from '@/components/Modal';
import React, { useState } from 'react';

interface IAcceptedRequestsProps {
  acceptedParticipants: IPendingActivityParticipant[];
  handleOpenProfile: (profileId: string) => void;
  handleManageRequestStatus: (status: PARTICIPANT_STATUS_ENUM, id: string) => void;
  activityId: string;
  onCompleteActivity: (reviewScore: number, activityId: string) => void;
}

const MIN_RATING = 1;
const MAX_RATING = 5;

const parseRating = (s: string): number | null => {
  const n = parseFloat(s.trim());
  if (Number.isNaN(n)) return null;
  if (n < MIN_RATING || n > MAX_RATING) return null;
  return n;
};

const RatingInput = ({
  value,
  onChangeText,
  placeholder = '1–5',
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}) => {
  const handleChange = (t: string) => {
    const filtered = t.replace(/[^0-9.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) return;
    if (parts[1] !== undefined && parts[1].length > 2) return;
    onChangeText(filtered);
  };

  return (
    <TextInput
      style={styles.ratingInput}
      value={value}
      onChangeText={handleChange}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType="decimal-pad"
      maxLength={4}
    />
  );
};

const CompleteActivityButton = ({
  onPress,
  disabled = false,
}: {
  onPress: () => void;
  disabled?: boolean;
}) => (
  <Pressable
    style={[styles.completeButton, disabled && styles.modalConfirmButtonDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name="checkmark-done-outline" size={18} color="#FFFFFF" />
    <Text style={styles.completeButtonText}>Complete Activity</Text>
  </Pressable>
);

const ParticipantDisplay = ({
  displayName,
  avatarUrl,
}: {
  displayName: string;
  avatarUrl: string | null;
}) => {
  const initials = displayName
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const hasAvatar = avatarUrl && avatarUrl.trim() !== '';

  return (
    <View style={styles.modalParticipantRow}>
      {hasAvatar ? (
        <Image source={{ uri: avatarUrl }} style={styles.modalParticipantAvatar} />
      ) : (
        <View style={styles.modalParticipantAvatarPlaceholder}>
          <Text style={styles.modalParticipantInitials}>{initials}</Text>
        </View>
      )}
      <Text style={styles.modalParticipantName}>{displayName}</Text>
    </View>
  );
};

export const AcceptedRequests = ({
  acceptedParticipants,
  handleOpenProfile,
  handleManageRequestStatus,
  activityId,
  onCompleteActivity,
}: IAcceptedRequestsProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ratingInput, setRatingInput] = useState('');
  const rating = parseRating(ratingInput);
  const isRatingValid = rating !== null;

  return (
    <View style={styles.acceptedSection}>
      <AppModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setRatingInput('');
        }}
        title="Complete Activity"
      >
        <View style={styles.modalContent}>
          {acceptedParticipants.length > 0 && (
            <>
              <ParticipantDisplay
                displayName={`${acceptedParticipants[0].user.first_name} ${acceptedParticipants[0].user.last_name}`}
                avatarUrl={acceptedParticipants[0].user.avatar_url}
              />
              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Rate your experience (1–5)</Text>
                <RatingInput
                  value={ratingInput}
                  onChangeText={setRatingInput}
                  placeholder="e.g. 4.5"
                />
              </View>
            </>
          )}
          <View style={styles.modalWarningBox}>
            <View style={styles.modalWarningIconWrap}>
              <Ionicons name="warning-outline" size={28} color="#B45309" />
            </View>
            <Text style={styles.modalWarningTitle}>This action cannot be undone</Text>
            <Text style={styles.modalWarningText}>
              Completing this activity will remove the chat and the activity.
            </Text>
          </View>
          <View style={styles.modalActions}>
            <Pressable
              style={styles.modalCancelButton}
              onPress={() => {
                setIsModalVisible(false);
                setRatingInput('');
              }}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </Pressable>
            <CompleteActivityButton
              onPress={() => {
                if (!isRatingValid || rating === null) return;
                onCompleteActivity(rating, activityId);

                setRatingInput('');
                setIsModalVisible(false);
              }}
              disabled={!isRatingValid}
            />
          </View>
        </View>
      </AppModal>
      <View style={styles.headerContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        <Text style={styles.sectionHeader}>Accepted Participants</Text>
      </View>

      {acceptedParticipants && acceptedParticipants.length > 0 ? (
        <View style={styles.participantsList}>
          {acceptedParticipants.map((participant) => (
            <LinearGradient
              key={participant.id}
              colors={['#F0FDF4', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.participantCard}
            >
              <View style={styles.participantInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={
                      participant.user.avatar_url
                        ? { uri: participant.user.avatar_url }
                        : require('@/assets/images/leonard_posa.jpeg')
                    }
                    style={styles.avatar}
                  />
                  <View style={styles.statusBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {participant.user.first_name} {participant.user.last_name}
                  </Text>
                  <Text style={styles.statusText}>Accepted</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <Pressable
                  style={styles.chatButton}
                  onPress={() => router.push(`/(chat)/${activityId}` as Href)}
                >
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.chatButtonGradient}
                  >
                    <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
                    <Text style={styles.chatButtonText}>Chat</Text>
                  </LinearGradient>
                </Pressable>
                <Pressable
                  style={styles.viewProfileButton}
                  onPress={() => handleOpenProfile(participant.user.id)}
                >
                  <Ionicons name="person-outline" size={18} color="#10B981" />
                  <Text style={styles.viewProfileText}>View</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() =>
                    handleManageRequestStatus(PARTICIPANT_STATUS_ENUM.DECLINED, participant.id)
                  }
                >
                  <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            </LinearGradient>
          ))}
          <View style={styles.completeContainer}>
            <CompleteActivityButton onPress={() => setIsModalVisible(true)} />
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No accepted participants yet</Text>
        </View>
      )}
    </View>
  );
};
