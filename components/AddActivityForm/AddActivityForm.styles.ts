import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
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
