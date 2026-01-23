// HangOutHeaderLogo.tsx
import React from 'react';
import Svg, { Defs, LinearGradient, Stop, SvgProps, Text as SvgText } from 'react-native-svg';

type HangOutHeaderLogoProps = SvgProps & {
  width?: number;
  height?: number;
};

export const HangOutLogo: React.FC<HangOutHeaderLogoProps> = ({
  width = 160,
  height = 48,
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 200 60"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <Defs>
      <LinearGradient id="hangoutGradient" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0%" stopColor="#FFC371" />
        <Stop offset="50%" stopColor="#FF5F6D" />
        <Stop offset="100%" stopColor="#D92550" />
      </LinearGradient>
    </Defs>

    <SvgText x={0} y={45} fontSize={48} fontFamily="Pacifico" fill="url(#hangoutGradient)">
      HangOut
    </SvgText>
  </Svg>
);
