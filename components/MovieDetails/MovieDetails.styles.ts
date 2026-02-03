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
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    lineHeight: 20,
  },
  movieInfoSection: {
    width: '100%',
  },
  movieMetadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  metadataText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metadataSeparator: {
    fontSize: 12,
    color: '#9CA3AF',
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
  reviewContainer: {
    left: 12,
    top: 12,
  },
  reviewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  removeIcon: {
    right: 12,
    top: 12,
  },

  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  skeleton: {
    position: 'absolute',
    backgroundColor: '#D1D5DB',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageLoading: {
    opacity: 0,
  },
});
