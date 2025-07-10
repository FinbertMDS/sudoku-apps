// services/board.service.ts

import {CELLS_TO_REMOVE_RANGE} from '@/utils/constants';
import {InitGame} from '@sudoku/shared-types/game';
import {generateBoardCommon} from '@sudoku/shared-utils/boardUtilsBE';

export function generateBoard(level: string, mode: string): InitGame {
  const initGame = generateBoardCommon(mode, level, CELLS_TO_REMOVE_RANGE);
  return initGame;
}
