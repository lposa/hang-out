import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  activityContainer: {
    marginBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  profilePicContainer: {
    zIndex: 2,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: '#82D0EE',
    shadowColor: '#82D0EE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },

  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  activityInformationContainer: {
    zIndex: 1,
    backgroundColor: 'whitesmoke',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#82D0EE',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    paddingTop: 20,
  },
  statusBorderBase: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  statusBorder_pending: {
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  statusBorder_in_progress: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  statusBorder_declined: {
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  statusBorder_completed: {
    borderColor: 'rgba(100, 116, 139, 0.35)',
  },

  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    zIndex: 10,
    borderWidth: 1,
    width: 100,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },

  statusPill_pending: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  statusPill_in_progress: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  statusPill_declined: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  statusPill_completed: {
    backgroundColor: 'rgba(100, 116, 139, 0.12)',
    borderColor: 'rgba(100, 116, 139, 0.25)',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.2,
  },

  activityCompleted: {
    opacity: 0.82,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee', // Added a default color for consistency
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginTop: 10,
    flexShrink: 1,
  },

  description: {
    color: '#666',
    lineHeight: 20,
  },

  contentSection: {
    marginVertical: 16,
  },
  detailsContainer: {
    marginTop: 24,
    gap: 10, // Using gap for spacing
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Using gap for spacing
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },

  // --- NEW STYLES FOR JOIN/REQUEST FLOW ---

  statusText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    paddingVertical: 10, // Added padding for better visibility
    backgroundColor: '#f0f0f0', // Light background
    borderRadius: 8,
  },
  requestsSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  requestsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  requestUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eee', // Placeholder background for missing avatar
  },
  requestUserName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  acceptButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  declineButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  noRequestsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
});
