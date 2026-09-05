import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii } from '../theme';

interface Props {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** "Вдавленный" вид (для активных вкладок/нажатых состояний). */
  inset?: boolean;
}

// Мягкая двойная тень (светлая сверху-слева, тёмная снизу-справа) эмулируется
// двумя абсолютно позиционированными панелями за контентом — так как в RN
// одна View может иметь только одну тень за раз. На Android цветные тени
// недоступны, поэтому там используется обычный elevation.
export default function Neumorphic({ children, style, radius = radii.card, inset = false }: Props) {
  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          {
            backgroundColor: colors.background,
            borderRadius: radius,
            elevation: inset ? 0 : 4,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  const dark = inset ? { width: -6, height: -6 } : { width: 6, height: 6 };
  const light = inset ? { width: 6, height: 6 } : { width: -6, height: -6 };

  return (
    <View style={style}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            backgroundColor: colors.background,
            shadowColor: colors.shadowDark,
            shadowOffset: dark,
            shadowOpacity: 0.5,
            shadowRadius: 8,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            backgroundColor: colors.background,
            shadowColor: colors.shadowLight,
            shadowOffset: light,
            shadowOpacity: 0.85,
            shadowRadius: 8,
          },
        ]}
      />
      <View style={{ borderRadius: radius, backgroundColor: colors.background, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}
