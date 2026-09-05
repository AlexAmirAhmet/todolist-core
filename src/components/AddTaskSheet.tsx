import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CalendarClock, X } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Priority, Task, TaskList } from '../types';
import { NewTaskInput } from '../context/TasksContext';
import { colors, priorityColors, priorityLabels, radii, spacing } from '../theme';
import Neumorphic from './Neumorphic';
import Chip from './Chip';
import RoundIconButton from './RoundIconButton';

interface Props {
  visible: boolean;
  lists: TaskList[];
  defaultListId: string;
  editingTask?: Task | null;
  onClose: () => void;
  onSubmit: (input: NewTaskInput) => void;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

function formatDueDate(date: Date): string {
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AddTaskSheet({
  visible,
  lists,
  defaultListId,
  editingTask,
  onClose,
  onSubmit,
}: Props) {
  const isEditing = !!editingTask;
  const [title, setTitle] = useState('');
  const [listId, setListId] = useState(defaultListId);
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const [androidStep, setAndroidStep] = useState<'date' | 'time' | null>(null);
  const [showIosPicker, setShowIosPicker] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (editingTask) {
      setTitle(editingTask.title);
      setListId(editingTask.listId);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueAt ? new Date(editingTask.dueAt) : null);
    } else {
      setTitle('');
      setPriority('medium');
      setDueDate(null);
      setListId(defaultListId === 'all' ? lists[0]?.id ?? defaultListId : defaultListId);
    }
  }, [visible, editingTask, defaultListId, lists]);

  const reset = () => {
    setTitle('');
    setPriority('medium');
    setDueDate(null);
    setPendingDate(null);
    setAndroidStep(null);
    setShowIosPicker(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed || !listId) return;
    onSubmit({
      title: trimmed,
      listId,
      priority,
      dueAt: dueDate ? dueDate.toISOString() : null,
    });
    reset();
    onClose();
  };

  const openDeadlinePicker = () => {
    if (Platform.OS === 'android') {
      setAndroidStep('date');
    } else {
      setShowIosPicker(true);
    }
  };

  const handleAndroidChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type !== 'set' || !selected) {
      setAndroidStep(null);
      return;
    }
    if (androidStep === 'date') {
      setPendingDate(selected);
      setAndroidStep('time');
    } else if (androidStep === 'time') {
      const base = pendingDate ?? new Date();
      const combined = new Date(base);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setDueDate(combined);
      setAndroidStep(null);
      setPendingDate(null);
    }
  };

  const handleIosChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) setDueDate(selected);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Neumorphic radius={radii.sheet} style={styles.sheet}>
              <View style={styles.handle} />
              <Text style={styles.heading}>{isEditing ? 'Изменить задачу' : 'Новая задача'}</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Название</Text>
                <Neumorphic radius={14} inset style={styles.inputWrap}>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Например, купить хлеб"
                    placeholderTextColor={colors.textTertiary}
                    style={styles.input}
                    autoFocus
                  />
                </Neumorphic>

                <Text style={styles.label}>Список</Text>
                <View style={styles.chipRow}>
                  {lists.map((list) => (
                    <Chip
                      key={list.id}
                      label={list.name}
                      active={listId === list.id}
                      onPress={() => setListId(list.id)}
                    />
                  ))}
                </View>

                <Text style={styles.label}>Приоритет</Text>
                <View style={styles.chipRow}>
                  {PRIORITIES.map((p) => (
                    <Chip
                      key={p}
                      label={priorityLabels[p]}
                      active={priority === p}
                      leftDot={priorityColors[p]}
                      onPress={() => setPriority(p)}
                    />
                  ))}
                </View>

                <Text style={styles.label}>Дедлайн</Text>
                <View style={styles.deadlineRow}>
                  <Pressable onPress={openDeadlinePicker} style={{ flex: 1 }}>
                    <Neumorphic radius={14} style={styles.deadlineChip}>
                      <CalendarClock size={16} color={colors.textSecondary} strokeWidth={1.75} />
                      <Text style={styles.deadlineText}>
                        {dueDate ? formatDueDate(dueDate) : 'Не установлен'}
                      </Text>
                    </Neumorphic>
                  </Pressable>
                  {dueDate ? (
                    <RoundIconButton size={40} onPress={() => setDueDate(null)}>
                      <X size={16} color={colors.textSecondary} strokeWidth={1.75} />
                    </RoundIconButton>
                  ) : null}
                </View>

                {Platform.OS === 'android' && androidStep && (
                  <DateTimePicker
                    value={pendingDate ?? dueDate ?? new Date()}
                    mode={androidStep}
                    display="default"
                    onChange={handleAndroidChange}
                  />
                )}

                {Platform.OS === 'ios' && showIosPicker && (
                  <View>
                    <DateTimePicker
                      value={dueDate ?? new Date()}
                      mode="datetime"
                      display="spinner"
                      onChange={handleIosChange}
                    />
                    <Pressable onPress={() => setShowIosPicker(false)} style={styles.doneBtn}>
                      <Text style={styles.doneText}>Готово</Text>
                    </Pressable>
                  </View>
                )}
              </ScrollView>

              <View style={styles.actions}>
                <Pressable onPress={handleClose} style={styles.actionBtn}>
                  <Text style={styles.cancelText}>Отмена</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmit}
                  disabled={!title.trim()}
                  style={styles.actionBtn}
                >
                  <Text style={[styles.saveText, !title.trim() && styles.saveTextDisabled]}>
                    {isEditing ? 'Сохранить' : 'Добавить'}
                  </Text>
                </Pressable>
              </View>
            </Neumorphic>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(60,64,72,0.25)',
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    width: '100%',
  },
  sheet: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.shadowDark,
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    paddingHorizontal: spacing.md,
  },
  input: {
    height: 46,
    fontSize: 15,
    color: colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deadlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  deadlineText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  doneBtn: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  doneText: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  actionBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  cancelText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  saveText: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '600',
  },
  saveTextDisabled: {
    color: colors.textTertiary,
  },
});
