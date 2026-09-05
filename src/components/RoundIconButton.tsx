import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Neumorphic from './Neumorphic';

interface Props {
  size?: number;
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inset?: boolean;
}

export default function RoundIconButton({ size = 44, onPress, children, style, inset = false }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Neumorphic
        radius={size / 2}
        inset={inset}
        style={[
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        {children}
      </Neumorphic>
    </Pressable>
  );
}
