import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { colors, radii, spacing } from '../theme';
import Neumorphic from './Neumorphic';

export default function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Neumorphic radius={radii.pill} style={styles.iconWrap}>
        <ClipboardList size={30} color={colors.textTertiary} strokeWidth={1.5} />
      </Neumorphic>
      <Text style={styles.title}>Пока пусто</Text>
      <Text style={styles.subtitle}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
