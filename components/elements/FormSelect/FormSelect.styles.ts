import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  valueText: {
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    color: '#111827',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
});
