// colorUtil.ts

import {Level} from '@sudoku/shared-types';
import {ColorSchemeName} from 'react-native';

export const playerColors = {
  red: {
    light: '#f87171', // red-400
    dark: '#ef4444', // red-500
  },
  blue: {
    light: '#60a5fa', // blue-400
    dark: '#3b82f6', // blue-500
  },
  green: {
    light: '#34d399', // green-400
    dark: '#10b981', // green-500
  },
  yellow: {
    light: '#fbbf24', // yellow-400
    dark: '#eab308', // yellow-500
  },
  purple: {
    light: '#8b5cf6', // purple-400
    dark: '#7c3aed', // purple-500
  },
} as const;

export type PlayerColorKey = keyof typeof playerColors;

export const getRandomColorKey = (): PlayerColorKey => {
  const keys = Object.keys(playerColors) as PlayerColorKey[];
  return keys[Math.floor(Math.random() * keys.length)];
};

export const getAvatarColor = (
  colorKey: PlayerColorKey,
  mode: ColorSchemeName,
) => {
  return playerColors[colorKey][mode === 'dark' ? 'dark' : 'light'];
};

export const getChartConfig = (mode: ColorSchemeName = 'light') => ({
  backgroundGradientFrom: mode === 'dark' ? '#1E1E1E' : '#ffffff',
  backgroundGradientTo: mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
  decimalPlaces: 0,
  color: (opacity = 1) =>
    mode === 'dark'
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => (mode === 'dark' ? '#ccc' : '#333'),
  propsForBackgroundLines: {
    stroke: mode === 'dark' ? '#333' : '#e0e0e0',
  },
  propsForLabels: {
    fill: mode === 'dark' ? '#fff' : '#111',
    fontSize: 12,
  },
});

export const medalColors = {
  light: ['#FFD700', '#C0C0C0', '#CD7F32'], // Gold, Silver, Bronze
  dark: ['#FACC15', '#A1A1AA', '#92400E'], // vàng sáng, xám nhẹ, đồng tối
};

export const levelColors: Record<Level, {light: string; dark: string}> = {
  easy: {
    light: '#4ade80', // green-400
    dark: '#22c55e', // green-500
  },
  medium: {
    light: '#60a5fa', // blue-400
    dark: '#3b82f6', // blue-500
  },
  hard: {
    light: '#facc15', // yellow-400
    dark: '#eab308', // yellow-500
  },
  expert: {
    light: '#f87171', // red-400
    dark: '#ef4444', // red-500
  },
};

export function getLevelColor(
  level: Level,
  scheme: ColorSchemeName = 'light',
): string {
  return levelColors[level][scheme!];
}
