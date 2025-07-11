// theme/themeStyles.ts

import type {ThemeType} from '@sudoku/shared-themes/types';

export const lightTheme: ThemeType = {
  primary: '#1E3A8A',
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',
  backgroundSecondary: '#F1F4F8',
  surface: '#F5F5F5',
  onSurface: '#1C1B1F',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  error: '#B3261E',
  onError: '#FFFFFF',
  success: '#0F9D58',
  danger: '#FF3B30',
  text: 'rgba(0, 0, 0, 0.87)',
  divider: 'rgba(0, 0, 0, 0.12)',
  iconColor: '#49454F',
  buttonBackground: '#1E3A8A',
  buttonText: '#FFFFFF',
  buttonBorder: '#1E3A8A',
  cell: '#F5F8FF',
  selectedOverlayColor: '#A5B4FC',
  sameValueOverlayColor: '#DBEAFE',
  conflictOverlayColor: '#FCA5A5',
  sameRowOrColumnOverlayColor: '#E0E7FF',
  overlayColor: '#FFFFFF',
  cellBorderColor: '#1E3A8A',
  settingItemBackground: '#DADADA',
  buttonBlue: '#007AFF',
  selectedItemBackground: '#D0D0D0',
  itemBorderColor: '#E0E0E0',
  modalBg: '#fff',
  inputBorder: '#ccc',
  placeholder: '#999',
  cancelButtonBg: '#f2f2f2',
  selectedCardBg: '#F0F8FF',
  card: '#F4F4F5',
  howToPlayBg: '#FFFFFF',
};

export const darkTheme: ThemeType = {
  primary: '#60A5FA', // Lighter version of #1E3A8A for dark background
  onPrimary: '#1E3A8A',
  background: '#0F172A',
  backgroundSecondary: '#1C1B1F',
  surface: '#1C1B1F',
  onSurface: '#FFFFFF',
  secondary: '#CCC2DC',
  onSecondary: '#332D41',
  error: '#EA0038',
  onError: '#000000',
  success: '#66BB6A',
  danger: '#EA0038',
  text: 'rgba(255, 255, 255, 1)',
  divider: 'rgba(255, 255, 255, 0.12)',
  iconColor: '#E0E0E0',
  buttonBackground: '#1E3A8A',
  buttonText: '#000000',
  buttonBorder: '#60A5FA',
  cell: '#1E293B',
  selectedOverlayColor: '#475569',
  sameValueOverlayColor: '#334155',
  conflictOverlayColor: '#EF4444',
  sameRowOrColumnOverlayColor: '#1E293B',
  overlayColor: '#1E293B',
  cellBorderColor: '#93C5FD',
  settingItemBackground: '#2C2C2C',
  buttonBlue: '#409CFF',
  selectedItemBackground: '#333333',
  itemBorderColor: '#2E2E2E',
  modalBg: '#2c2c2e',
  inputBorder: '#555',
  placeholder: '#888',
  cancelButtonBg: '#3a3a3c',
  selectedCardBg: '#0c1a2f',
  card: '#1E1E1E',
  howToPlayBg: '#15151A',
};
