// game.ts

export type AppMode = 'killer' | 'classic';

export type Cell = {
  row: number;
  col: number;
  value: CellValue;
};

export type CellValue = number | null;

export type Level = string;
export type LevelPriority = Level[];
export type LevelWeight = Record<Level, number>;

export type GameInfo = {
  id: string;
  initialBoard: CellValue[][];
  solvedBoard: CellValue[][];
};

export type GenericInitGame<TLevel, TExtra = {}> = GameInfo & {
  savedLevel: TLevel;
} & TExtra;
export type InitGame = GenericInitGame<any, any>;

export type GenericSavedGame<TLevel, TExtra = {}> = {
  savedId: string;
  savedLevel: TLevel;
  savedBoard: CellValue[][];

  savedHintCount: number;
  savedTotalHintCountUsed: number;
  savedMistake: number;
  savedTotalMistake: number;
  savedTimePlayed: number;

  savedHistory: CellValue[][][];
  savedNotes: string[][][];
  lastSaved: Date;
} & TExtra;
export type SavedGame = GenericSavedGame<any, any>;

export type SavedMistake = {
  savedMistake: number;
  savedTotalMistake: number;
};

export type SavedHintCount = {
  savedHintCount: number;
  savedTotalHintCountUsed: number;
};

export type GenerateBoardFn = (level: Level, id: string) => InitGame;

// ---------------- Killer Sudoku ----------------
export type CageInfo = {
  cells: [number, number][];
  sum: number;
};
// ---------------- Killer Sudoku ----------------
