// ProfileCard.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textColumn: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  birthday: {
    fontSize: 15,
    color: '#555555',
    marginTop: 4,
    fontWeight: '500',
  },
});
