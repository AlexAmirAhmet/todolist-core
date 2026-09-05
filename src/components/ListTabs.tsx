import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { TaskList } from '../types';
import { colors, radii, spacing } from '../theme';
import Neumorphic from './Neumorphic';
import Chip from './Chip';

export const ALL_LIST_ID = 'all';

interface Props {
  lists: TaskList[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddList: () => void;
}

export default function ListTabs({ lists, activeId, onSelect, onAddList }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Chip label="Все" active={activeId === ALL_LIST_ID} onPress={() => onSelect(ALL_LIST_ID)} />
      {lists.map((list) => (
        <Chip
          key={list.id}
          label={list.name}
          active={activeId === list.id}
          onPress={() => onSelect(list.id)}
        />
      ))}
      <Pressable onPress={onAddList} hitSlop={8}>
        <Neumorphic radius={radii.pill} style={styles.addPill}>
          <Plus size={16} color={colors.textSecondary} strokeWidth={1.75} />
        </Neumorphic>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  addPill: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
