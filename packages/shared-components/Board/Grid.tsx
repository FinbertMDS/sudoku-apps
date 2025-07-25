// Board/BaseGrid.tsx

import {CageBorders} from '@sudoku/shared-components/Board/CageBorders';
import {useTheme} from '@sudoku/shared-themes';
import {AppSettings, CageInfo, Cell, CellValue} from '@sudoku/shared-types';
import {
  ANIMATION_DURATION,
  ANIMATION_TYPE,
  BOARD_SIZE,
  CELL_SIZE,
  DeviceUtil,
  getFontSizesFromCellSize,
  isColFilled,
  isRowFilled,
} from '@sudoku/shared-utils';
import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type GridProps = {
  showCage: boolean;
  board: CellValue[][];
  cages: CageInfo[];
  notes: string[][][];
  solvedBoard: number[][];
  selectedCell: Cell | null;
  settings: AppSettings;
  onPress: (cell: Cell | null) => void;
};

const GridComponent = ({
  showCage,
  board,
  cages,
  notes,
  solvedBoard,
  selectedCell,
  settings,
  onPress,
}: GridProps) => {
  const {mode, theme} = useTheme();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const rowScales = Array.from({length: BOARD_SIZE}, () => useSharedValue(1));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const colScales = Array.from({length: BOARD_SIZE}, () => useSharedValue(1));

  const cellSize = CELL_SIZE;

  const {cellText, noteText, cageText, noteWidth} = getFontSizesFromCellSize();

  const animatedStyles = useRef(
    Array.from({length: BOARD_SIZE}, (_, row) =>
      Array.from({length: BOARD_SIZE}, (__, col) =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useAnimatedStyle(() => ({
          transform: [{scale: rowScales[row].value * colScales[col].value}],
        })),
      ),
    ),
  ).current;

  const handleAnimation = (row: number, col: number) => {
    let animationType = ANIMATION_TYPE.NONE as number;
    if (
      isRowFilled(row, board, solvedBoard) &&
      isColFilled(col, board, solvedBoard)
    ) {
      animationType = ANIMATION_TYPE.ROW_COL;
    } else if (isRowFilled(row, board, solvedBoard)) {
      animationType = ANIMATION_TYPE.ROW;
    } else if (isColFilled(col, board, solvedBoard)) {
      animationType = ANIMATION_TYPE.COL;
    }
    if (animationType === ANIMATION_TYPE.NONE) {
      return;
    }

    if (
      animationType === ANIMATION_TYPE.ROW ||
      animationType === ANIMATION_TYPE.ROW_COL
    ) {
      rowScales[row].value = withSequence(
        withTiming(0.3, {duration: ANIMATION_DURATION / 3}),
        withTiming(1, {duration: ANIMATION_DURATION / 3}),
      );
    }
    if (
      animationType === ANIMATION_TYPE.COL ||
      animationType === ANIMATION_TYPE.ROW_COL
    ) {
      colScales[col].value = withSequence(
        withTiming(0.3, {duration: ANIMATION_DURATION / 3}),
        withTiming(1, {duration: ANIMATION_DURATION / 3}),
      );
    }
  };

  useEffect(() => {
    if (selectedCell) {
      handleAnimation(selectedCell.row, selectedCell.col);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const isCellInSameRowOrColOrBox = (row: number, col: number) => {
    if (!selectedCell) {
      return false;
    }
    const selRow = selectedCell.row;
    const selCol = selectedCell.col;
    const inSameBox =
      Math.floor(selRow / 3) === Math.floor(row / 3) &&
      Math.floor(selCol / 3) === Math.floor(col / 3);
    return selRow === row || selCol === col || inSameBox;
  };

  const getCageForCell = (row: number, col: number): CageInfo | null => {
    if (!showCage || !cages || cages.length === 0) {
      return null;
    }
    return (
      cages.find((cage) =>
        cage.cells.some((cell) => cell[0] === row && cell[1] === col),
      ) || null
    );
  };

  const checkSameValueConflict = (
    row: number,
    col: number,
    cellValue: CellValue,
    _selectedCell: Cell | null,
  ): boolean => {
    if (!cellValue || !_selectedCell) {
      return false;
    }

    const sameValue = cellValue === _selectedCell.value;
    const sameRow = row === _selectedCell.row;
    const sameCol = col === _selectedCell.col;
    const sameBox =
      Math.floor(row / 3) === Math.floor(_selectedCell.row / 3) &&
      Math.floor(col / 3) === Math.floor(_selectedCell.col / 3);

    return sameValue && (sameRow || sameCol || sameBox);
  };

  const renderCell = useCallback(
    (row: number, col: number, animatedStyle: any) => {
      const cellValue = board[row][col];
      const cellNotes = notes[row][col];
      const cage = getCageForCell(row, col);
      const isCageFirst =
        cage?.cells[0][0] === row && cage?.cells[0][1] === col;

      const isSelected = selectedCell?.row === row && selectedCell?.col === col;

      const isRelated =
        settings.highlightAreas && isCellInSameRowOrColOrBox(row, col);

      const isSameValue =
        settings.highlightIdenticalNumbers &&
        !isSelected &&
        cellValue &&
        cellValue === selectedCell?.value;

      const isSameValueConflict =
        settings.highlightDuplicates &&
        checkSameValueConflict(row, col, cellValue, selectedCell);

      const isMistake = cellValue !== 0 && cellValue !== solvedBoard[row][col];

      let overlayColor: string | null = null;
      if (isSelected) {
        overlayColor = theme.selectedOverlayColor;
      } else if (isSameValueConflict) {
        overlayColor = theme.conflictOverlayColor;
      } else if (isRelated) {
        overlayColor = theme.sameRowOrColumnOverlayColor;
      } else if (isSameValue) {
        overlayColor = theme.sameValueOverlayColor;
      }

      const showValue = cellValue !== 0;
      const showMistake = settings.autoCheckMistake && isMistake;

      const isBoldBorder = (index: number) => index % 3 === 0;
      const isLastBolBorder = (index: number) => index === BOARD_SIZE - 1;

      const isTablet = DeviceUtil.isTablet();
      const thinBorder = isTablet ? 0.5 : 0.2;
      const thickBorderDark = isTablet ? 3.5 : 3;
      const thickBorderLight = isTablet ? 2.5 : 2;
      const borderStyle = {
        borderColor: theme.cellBorderColor,
        borderTopWidth: isBoldBorder(row)
          ? mode === 'dark'
            ? thickBorderDark
            : thickBorderLight
          : thinBorder,
        borderBottomWidth: isLastBolBorder(row)
          ? mode === 'dark'
            ? thickBorderDark
            : thickBorderLight
          : thinBorder,
        borderLeftWidth: isBoldBorder(col)
          ? mode === 'dark'
            ? thickBorderDark
            : thickBorderLight
          : thinBorder,
        borderRightWidth:
          col === BOARD_SIZE - 1
            ? mode === 'dark'
              ? thickBorderDark
              : thickBorderLight
            : thinBorder,
      };

      return (
        <View
          key={`cell-${row}-${col}`}
          style={[
            styles.cellWrapper,
            {
              backgroundColor: theme.overlayColor,
              width: cellSize,
              height: cellSize,
            },
          ]}>
          {overlayColor && (
            <View style={[styles.overlay, {backgroundColor: overlayColor}]} />
          )}

          <TouchableOpacity
            style={[
              styles.cell,
              borderStyle,
              {width: cellSize, height: cellSize},
            ]}
            onPress={() => onPress({row, col, value: cellValue})}
            activeOpacity={0.8}>
            {isCageFirst && (
              <Text
                style={[
                  styles.cageText,
                  {color: theme.secondary, fontSize: cageText},
                ]}>
                {cage?.sum}
              </Text>
            )}

            {cellNotes.length > 0 && (
              <View style={styles.notesContainerTop}>
                {Array.from({length: BOARD_SIZE}, (_, i) => {
                  const noteValue = (i + 1).toString();
                  return (
                    <Text
                      key={i}
                      style={[
                        styles.noteText,
                        {
                          color: theme.text,
                          fontSize: noteText,
                          width: noteWidth,
                        },
                      ]}>
                      {cellNotes.includes(noteValue) ? i + 1 : ' '}
                    </Text>
                  );
                })}
              </View>
            )}

            <Animated.View
              style={[
                styles.cell,
                animatedStyle,
                {width: cellSize, height: cellSize},
              ]}
              pointerEvents="box-none">
              {showValue && (
                <Text
                  style={[
                    styles.cellText,
                    {color: theme.text, fontSize: cellText},
                    showMistake && {color: theme.danger},
                  ]}>
                  {cellValue}
                </Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [board, notes, selectedCell, settings, solvedBoard, theme, onPress],
  );

  return (
    <>
      {/* Board Sudoku */}
      <View style={styles.boardContainer}>
        <View
          style={{
            width: cellSize * BOARD_SIZE,
            height: cellSize * BOARD_SIZE,
          }}>
          <View style={styles.grid}>
            {board.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((col, j) => {
                  return renderCell(i, j, animatedStyles[i][j]);
                })}
              </View>
            ))}
          </View>

          {showCage && <CageBorders cages={cages} />}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    width: '100%' as const,
    alignItems: 'center' as const,
    marginTop: DeviceUtil.isTablet() ? 20 : 0,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'column' as const,
    width: '100%' as const,
    height: '100%' as const,
  },
  row: {
    flexDirection: 'row' as const,
  },
  cellWrapper: {
    position: 'relative' as const,
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%' as const,
    height: '100%' as const,
    zIndex: 4,
  },
  cell: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 20,
  },
  cellText: {
    fontWeight: '500',
  },
  notesContainerTop: {
    position: 'absolute' as const,
    left: 4,
    right: 4,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'flex-start' as const,
  },
  noteText: {
    top: 0,
    left: 2,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
  },
  cageText: {
    position: 'absolute' as const,
    top: -1,
    left: 1,
    fontWeight: '600',
  },
});

export const Grid = React.memo(GridComponent);
