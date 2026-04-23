import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  progressBarContainer: {
    backgroundColor: '#82D0EE',
    opacity: 0.5,
    width: '100%',
    height: 20,
    marginTop: 5,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,

    elevation: 2,
  },

  square: {
    flex: 1,
    height: 20,
  },
  circularWrapper: {
    width: 50,
    height: 50,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  circularCenterLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularPercentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
  },
});
