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
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
});
