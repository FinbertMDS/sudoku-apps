// services/board.service.ts

import {InitGame} from '@sudoku/shared-types/game';
import {generateBoardCommon} from '@sudoku/shared-utils/boardUtilsBE';

export function generateBoard(level: string, mode: string): InitGame {
  console.log('generateBoard', level, mode);
  const initGame = generateBoardCommon(mode, level);
  return initGame;
}
