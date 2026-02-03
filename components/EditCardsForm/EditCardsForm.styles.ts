import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#2563EB',
  },
  formContainer: {
    padding: 20,
  },
  counterContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    borderColor: '#E5E7EB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
  },
  counterText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
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
