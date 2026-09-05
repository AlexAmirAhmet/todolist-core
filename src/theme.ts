export const colors = {
  background: '#E9EBF0',
  surface: '#E9EBF0',
  textPrimary: '#3C4048',
  textSecondary: '#9AA0AA',
  textTertiary: '#C1C5CC',
  shadowDark: '#AEB8C8',
  shadowLight: '#FFFFFF',
  danger: '#E4574C',
  accent: '#6C8CFF',
  priorityLow: '#6FCF97',
  priorityMedium: '#F2B94D',
  priorityHigh: '#EB5B5B',
} as const;

export const radii = {
  card: 22,
  pill: 999,
  sheet: 28,
  icon: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const priorityLabels: Record<'low' | 'medium' | 'high', string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const priorityColors: Record<'low' | 'medium' | 'high', string> = {
  low: colors.priorityLow,
  medium: colors.priorityMedium,
  high: colors.priorityHigh,
};
