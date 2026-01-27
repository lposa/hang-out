import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  movieDetailsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  movieDetailsPoster: {
    width: 150,
    height: 200,
    borderRadius: 8,
  },
  movieDetailsTextContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    minWidth: 0,
  },
  movieDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    flexShrink: 1,
  },
  movieDetailsOverview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flexShrink: 1,
  },

  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    lineHeight: 18,
  },
  movieExtraDetails: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 5,
  },
  movieGenreContainer: {
    gap: 1,
  },
});
