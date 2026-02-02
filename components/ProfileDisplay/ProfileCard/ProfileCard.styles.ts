// ProfileCard.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 0.3,
  },
  birthday: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
  },

  controlCenter: {
    marginTop: 16,
  },

  controlButton: {
    backgroundColor: '#E5F0FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
