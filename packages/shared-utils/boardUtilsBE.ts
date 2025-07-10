// boardUtilsBE.ts

import {Level} from '@sudoku/shared-types';
import {
  randomBetween,
  sortAreasCells,
} from '@sudoku/shared-utils/boardUtilCommon';
import {
  generateKillerSudoku,
  overrideNumberOfCellsToRemove,
} from 'killer-sudoku-generator';
import {getSudoku} from 'sudoku-gen';
import {Difficulty} from 'sudoku-gen/dist/types/difficulty.type';
import {v4 as uuidv4} from 'uuid';

export const generateBoardCommon = (
  mode: string,
  level: string,
  cellsToRemoveRange?: Record<Level, number[]>,
) => {
  if (mode === 'killer') {
    return generateKillerBoard(level, cellsToRemoveRange);
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

export const generateKillerBoard = (
  level: string,
  cellsToRemoveRange?: Record<Level, number[]>,
  id?: string,
) => {
  let _id = id;
  if (!_id) {
    _id = uuidv4().toString();
  }

  if (cellsToRemoveRange) {
    const [min, max] = cellsToRemoveRange[level];
    const randomNumber = randomBetween(min, max);
    overrideNumberOfCellsToRemove(level as Difficulty, randomNumber);
  }
  const sudoku = generateKillerSudoku(level as Difficulty);

  const initGame = {
    id: _id,
    initialBoard: sudoku.puzzle,
    solvedBoard: sudoku.solution,
    cages: sortAreasCells(sudoku.areas),
    savedLevel: level,
  };

  return initGame;
};
