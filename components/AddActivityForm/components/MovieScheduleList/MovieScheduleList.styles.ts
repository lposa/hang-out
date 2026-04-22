import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    gap: 12,
  },
  poster: {
    width: 84,
    height: 126,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  premiereBadge: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  premiereBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: '#92400E',
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  description: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  timePill: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
});
