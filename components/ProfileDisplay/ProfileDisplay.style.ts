import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  profileDisplayContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },

  movieCard: {
    marginRight: 12,
  },
  movieCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  movieCardImage: {
    width: '100%',
    height: 400,
    borderRadius: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#E5F0FF',
    borderRadius: 12,
  },
});
