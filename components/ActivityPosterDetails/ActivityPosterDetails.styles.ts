import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  activityPosterDetailsContainer: {
    position: 'absolute',
    zIndex: 2,
    left: 175,
    top: -80,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 180,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  posterInfo: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  posterName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 6,
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewScoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  matchScoreText: {
    color: '#000000',
    fontWeight: '600',
  },
  matchContainer: {
    backgroundColor: '#F4F7FF',
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
