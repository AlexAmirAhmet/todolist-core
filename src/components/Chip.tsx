import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme';
import Neumorphic from './Neumorphic';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
  leftDot?: string;
}

export default function Chip({ label, active, onPress, leftDot }: Props) {
  return (
    <Pressable onPress={onPress}>
      <Neumorphic radius={radii.pill} inset={active} style={styles.pill}>
        <View style={styles.content}>
          {leftDot ? <View style={[styles.dot, { backgroundColor: leftDot }]} /> : null}
          <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
        </View>
      </Neumorphic>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  textActive: {
    color: colors.textPrimary,
  },
});
