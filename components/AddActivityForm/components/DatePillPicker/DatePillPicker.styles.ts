import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
  },
  contentContainer: {
    paddingHorizontal: 2,
    gap: 10,
  },
  pill: {
    minWidth: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'capitalize',
  },
  dayTextActive: {
    color: '#1D4ED8',
  },
  dateText: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateTextActive: {
    color: '#1E3A8A',
  },
});
