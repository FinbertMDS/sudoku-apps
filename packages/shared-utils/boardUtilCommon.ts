// boardUtilCommon.ts

import {CageInfo} from '@sudoku/shared-types';

// ---------------- Killer Sudoku ----------------

export function sortAreasCells(areas: CageInfo[]): CageInfo[] {
  return areas.map((cage) => ({
    ...cage,
    cells: [...cage.cells].sort((a, b) => {
      if (a[0] !== b[0]) {
        // Ưu tiên hàng (row) trước
        return a[0] - b[0];
      }
      // Nếu cùng hàng, ưu tiên cột (col)
      return a[1] - b[1];
    }),
  }));
}

// ---------------- Killer Sudoku ----------------

// ---------------- Common Sudoku ----------------

export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ---------------- Common Sudoku ----------------
