// types/classicGame.ts

import {GenericInitGame, GenericSavedGame} from '@sudoku/shared-types';
import {CLASSIC_LEVELS} from '../utils/constants';

export type ClassicLevel = (typeof CLASSIC_LEVELS)[number];

export type ClassicInitGame = GenericInitGame<
  ClassicLevel,
  // TODO: add savedScore
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {
    // savedScore: number;
  }
>;

export type ClassicSavedGame = GenericSavedGame<ClassicLevel>;
