import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  movieDetailsPoster: {
    width: 150,
    height: 200,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  movieDescriptionContainer: {
    minWidth: 0,
  },
  movieDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  imageBadge: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    gap: 4,
  },

  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  skeleton: {
    position: 'absolute',
    backgroundColor: '#D1D5DB',
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageLoading: {
    opacity: 0,
  },
});
