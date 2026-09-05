import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing } from '../theme';
import Neumorphic from './Neumorphic';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function AddListModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Neumorphic radius={radii.sheet} style={styles.card}>
            <Text style={styles.title}>Новый список</Text>
            <Neumorphic radius={14} inset style={styles.inputWrap}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Название списка"
                placeholderTextColor={colors.textTertiary}
                style={styles.input}
                autoFocus
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
            </Neumorphic>
            <View style={styles.actions}>
              <Pressable onPress={handleClose} style={styles.actionBtn}>
                <Text style={styles.cancelText}>Отмена</Text>
              </Pressable>
              <Pressable onPress={handleSubmit} style={styles.actionBtn}>
                <Text style={styles.saveText}>Добавить</Text>
              </Pressable>
            </View>
          </Neumorphic>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(60,64,72,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    padding: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputWrap: {
    paddingHorizontal: spacing.md,
  },
  input: {
    height: 46,
    fontSize: 15,
    color: colors.textPrimary,
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
});
