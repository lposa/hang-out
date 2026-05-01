import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  matchScoreText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 13,
  },
  matchContainer: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  matchContainerCircular: {
    alignItems: 'center',
  },
  calculateButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonDisabled: {
    opacity: 0.7,
  },
  calculateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  circularInteractiveArea: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  circularPlaceholderButton: {
    minWidth: 76,
    width: 100,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularPlaceholderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
