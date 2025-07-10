// boardUtilsBE.ts

import {
  CELLS_TO_REMOVE_RANGE,
  setRandomCellsToRemoveForLevel,
  sortAreasCells,
  stringToGrid,
} from '@sudoku/shared-utils';
import {generateKillerSudoku} from 'killer-sudoku-generator';
import {getSudoku} from 'sudoku-gen';
import {v4 as uuidv4} from 'uuid';

export const generateBoardCommon = (mode: string, level: string) => {
  console.log('generateBoardCommon', mode, level);
  if (mode === 'killer') {
    return generateKillerBoard(level);
  }
  return generateClassicBoard(level);
};

export const generateClassicBoard = (level: string, id?: string) => {
  let _id = id;
  if (!_id) {
    _id = uuidv4().toString();
  }
  const board = getSudoku(level as any);
  const initGame = {
    id: _id,
    initialBoard: board.puzzle,
    solvedBoard: board.solution,
    savedLevel: level,
    // savedScore: 0,
  };

  return initGame;
};

export const generateKillerBoard = (level: string, id?: string) => {
  let _id = id;
  if (!_id) {
    _id = uuidv4().toString();
  }
  setRandomCellsToRemoveForLevel(level, CELLS_TO_REMOVE_RANGE);
  const sudoku = generateKillerSudoku(level as any);

  const initGame = {
    id: _id,
    initialBoard: stringToGrid(sudoku.puzzle),
    solvedBoard: stringToGrid(sudoku.solution),
    cages: sortAreasCells(sudoku.areas),
    savedLevel: level,
  };

  return initGame;
};
