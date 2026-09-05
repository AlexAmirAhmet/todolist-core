import React from 'react';
import { View } from 'react-native';
import { Priority } from '../types';
import { priorityColors } from '../theme';

export default function PriorityDot({ priority, size = 8 }: { priority: Priority; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: priorityColors[priority],
      }}
    />
  );
}
