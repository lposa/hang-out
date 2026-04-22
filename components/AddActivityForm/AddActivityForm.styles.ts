import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  clearPrefilledButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  clearPrefilledButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 16,
    overflow: 'hidden',
  },
  pricePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  pricePrefixText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  priceInput: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: 'transparent',
    paddingLeft: 12,
  },
});
