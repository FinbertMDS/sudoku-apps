// utils/constants.ts

import {Level} from '@sudoku/shared-types';

export const CLASSIC_LEVELS = ['easy', 'medium', 'hard', 'expert'] as Level[];

export const KILLER_LEVELS = ['easy', 'medium', 'hard', 'expert'] as Level[];

export const CELLS_TO_REMOVE_RANGE: Record<Level, number[]> = {
  easy: [30, 34],
  medium: [40, 46],
  hard: [50, 54],
  expert: [60, 64],
};
