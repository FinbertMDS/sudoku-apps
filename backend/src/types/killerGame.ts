// src/types/killerGame.ts

import {KILLER_LEVELS} from '@/utils/constants';
import {
  CageInfo,
  GenericInitGame,
  GenericSavedGame,
} from '@sudoku/shared-types';

export type KillerLevel = (typeof KILLER_LEVELS)[number];

export type KillerInitGame = GenericInitGame<
  KillerLevel,
  {
    cages: CageInfo[];
  }
>;

export type KillerSavedGame = GenericSavedGame<KillerLevel>;
