import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loadingContainer: {
    width: '100%',
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
  },
  syncButtonContainer: {
    marginTop: 12,
  },
  activeDateLabel: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    textTransform: 'capitalize',
  },
});
