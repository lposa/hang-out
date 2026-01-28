import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  activityPosterDetailsContainer: {
    position: 'absolute',
    zIndex: 2,
    left: 155,
    top: -70,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 180,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  posterInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backdropFilter: 'blur(10px)',
  },
  posterName: {
    fontWeight: '600',
    fontSize: 15,
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
    color: '#111827',
    fontWeight: '600',
    fontSize: 13,
  },
  matchContainer: {
    backgroundColor: '#E5F0FF',
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
