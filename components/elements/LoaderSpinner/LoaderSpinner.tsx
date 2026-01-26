import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import Svg, { Circle } from 'react-native-svg';
import { View } from 'react-native';
import { styles } from './LoaderSpinner.styles';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface ISpinnerProps {
  size?: number;
  color?: string;
  duration?: number;
}

export const LoaderSpinner = ({ size = 40, color = '#3AAAD9', duration = 1000 }: ISpinnerProps) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: duration,
        easing: Easing.linear,
      }),
      -1
    );

    return () => {
      cancelAnimation(rotation);
    };
  }, [duration, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference * 0.75} ${circumference * 0.25}`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <AnimatedSvg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={animatedStyle}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          fill="transparent"
        />
      </AnimatedSvg>
    </View>
  );
};
