import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  movieDetailsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
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
});
