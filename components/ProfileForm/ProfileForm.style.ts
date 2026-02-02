import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  profileFormContainer: {
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  customMovieDetailsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 250,
    height: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 0,
    marginBottom: 0,
    paddingTop: 0,
  },
  customMovieImage: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectedSearchResultOutline: {
    shadowColor: '#FF5F6D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  movieWrapper: {
    position: 'relative',
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  checkmarkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF5F6D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectionContainer: {
    padding: 4,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectionText: {
    color: '#FFFFFF',
  },
  selectionItemWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectionItem: {
    padding: 4,
  },
  errorText: {
    color: '#FFECEC',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 13,
  },

  buttonContainer: {
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  cancelButtonText: {
    fontWeight: 'bold',
  },
});
