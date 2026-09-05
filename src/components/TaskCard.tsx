import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Clock, Trash2 } from 'lucide-react-native';
import { Task } from '../types';
import { colors, radii, spacing } from '../theme';
import Neumorphic from './Neumorphic';
import PriorityDot from './PriorityDot';
import { isOverdue } from '../utils/sortTasks';

interface Props {
  task: Task;
  listName?: string;
  onToggle: () => void;
  onDelete: () => void;
}

function formatDueDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TaskCard({ task, listName, onToggle, onDelete }: Props) {
  const overdue = isOverdue(task);

  const handleDelete = () => {
    Alert.alert('Удалить задачу?', task.title, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Neumorphic radius={radii.card} style={styles.card}>
      <Pressable onPress={onToggle} hitSlop={8}>
        <Neumorphic radius={13} inset={task.completed} style={styles.checkbox}>
          {task.completed && <Check size={16} color={colors.priorityLow} strokeWidth={2.5} />}
        </Neumorphic>
      </Pressable>

      <View style={styles.body}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          <PriorityDot priority={task.priority} />
          {listName ? <Text style={styles.metaText}>{listName}</Text> : null}
          {task.dueAt ? (
            <View style={styles.dueRow}>
              <Clock size={12} color={overdue ? colors.danger : colors.textTertiary} strokeWidth={1.75} />
              <Text style={[styles.metaText, overdue && styles.overdueText]}>
                {formatDueDate(task.dueAt)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
        <Trash2 size={18} color={colors.textTertiary} strokeWidth={1.75} />
      </Pressable>
    </Neumorphic>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  checkbox: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  titleDone: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  metaText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overdueText: {
    color: colors.danger,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
});
