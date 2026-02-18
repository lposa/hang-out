import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  activityContainer: {
    marginBottom: 30,
  },

  profilePicContainer: {
    position: 'absolute',
    zIndex: 2,
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -75,
    left: 20,
    shadowColor: '#82D0EE',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 12,
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
