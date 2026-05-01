import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  activityPosterDetailsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  posterInfo: {},
  posterName: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },

  reviewScoreText: {
    fontSize: 13,
    fontWeight: '400',
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
  calculateButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonDisabled: {
    opacity: 0.7,
  },
  calculateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
