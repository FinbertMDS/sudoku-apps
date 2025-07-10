// Board/CageBorders.tsx

import {useTheme} from '@sudoku/shared-themes';
import {CageInfo} from '@sudoku/shared-types';
import {
  BOARD_SIZE,
  CAGE_PADDING,
  CELL_SIZE,
  getAdjacentCellsInSameCage,
} from '@sudoku/shared-utils';
import React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Line} from 'react-native-svg';

type CageBordersProps = {
  cages: CageInfo[];
};

const CageBordersComponent = ({cages}: CageBordersProps) => {
  const {theme} = useTheme();

  const renderCageBorders = () => {
    // Map từ (row,col) => cage index
    const cageMap = new Map<string, number>();
    cages.forEach((cage, index) => {
      for (const [r, c] of cage.cells) {
        cageMap.set(`${r},${c}`, index);
      }
    });

    const lines: React.ReactNode[] = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const thisCageIdx = cageMap.get(`${r},${c}`);

        if (thisCageIdx == null) {
          continue;
        } // bỏ qua ô không thuộc cage nào

        const cage = cages[thisCageIdx];
        const cagePaddingFirstRight = cage && cage?.sum < 10 ? 7 : 12;
        const cagePaddingFirstBottom = cage && cage?.sum < 10 ? 8 : 9;
        const isCageFirst =
          cage && cage?.cells[0][0] === r && cage?.cells[0][1] === c;

        const adjacentCells = getAdjacentCellsInSameCage(r, c, cages);

        // 1. Vẽ bên phải nếu neighbor khác cage
        if (c <= 8) {
          const rightCageIdx = cageMap.get(`${r},${c + 1}`);
          if (thisCageIdx !== rightCageIdx) {
            lines.push(
              <Line
                key={`right-${r}-${c}`}
                x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
                y1={r * CELL_SIZE + (adjacentCells.top ? 0 : CAGE_PADDING)}
                x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
                y2={
                  (r + 1) * CELL_SIZE -
                  (adjacentCells.bottom ? 0 : CAGE_PADDING)
                }
                stroke={theme.secondary}
                strokeWidth={1}
                strokeDasharray="2,2"
                strokeLinecap="round"
              />,
            );
          }
        }

        // 2. Vẽ bên dưới nếu neighbor khác cage
        if (r <= 8) {
          const bottomCageIdx = cageMap.get(`${r + 1},${c}`);
          if (thisCageIdx !== bottomCageIdx) {
            lines.push(
              <Line
                key={`bottom-${r}-${c}`}
                x1={c * CELL_SIZE + (adjacentCells.left ? 0 : CAGE_PADDING)}
                y1={(r + 1) * CELL_SIZE - CAGE_PADDING}
                x2={
                  (c + 1) * CELL_SIZE - (adjacentCells.right ? 0 : CAGE_PADDING)
                }
                y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
                stroke={theme.secondary}
                strokeWidth={1}
                strokeDasharray="2,2"
                strokeLinecap="round"
              />,
            );
          }
        }

        // 3. Vẽ bên trái nếu là cột 0 hoặc neighbor left khác cage
        if (c === 0 || cageMap.get(`${r},${c - 1}`) !== thisCageIdx) {
          lines.push(
            <Line
              key={`left-${r}-${c}`}
              x1={c * CELL_SIZE + CAGE_PADDING}
              y1={
                r * CELL_SIZE +
                (isCageFirst ? cagePaddingFirstBottom : 0) +
                (adjacentCells.top ? 0 : CAGE_PADDING)
              }
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={
                (r + 1) * CELL_SIZE - (adjacentCells.bottom ? 0 : CAGE_PADDING)
              }
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

        // 4. Vẽ bên trên nếu là hàng 0 hoặc neighbor top khác cage
        if (r === 0 || cageMap.get(`${r - 1},${c}`) !== thisCageIdx) {
          lines.push(
            <Line
              key={`top-${r}-${c}`}
              x1={
                c * CELL_SIZE +
                (isCageFirst ? cagePaddingFirstRight : 0) +
                (adjacentCells.left
                  ? adjacentCells.right
                    ? -CAGE_PADDING
                    : 0
                  : CAGE_PADDING)
              }
              y1={r * CELL_SIZE + CAGE_PADDING}
              x2={
                (c + 1) * CELL_SIZE - (adjacentCells.right ? 0 : CAGE_PADDING)
              }
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

        // 5. Vẽ góc phần tư thứ nhất nếu có neighbor trên và bên trái cùng cage
        if (adjacentCells.top && adjacentCells.left && !adjacentCells.topleft) {
          lines.push(
            <Line
              key={`top-left-corner-${r}-${c}`}
              x1={c * CELL_SIZE}
              y1={r * CELL_SIZE + CAGE_PADDING}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`top-left-corner-${r}-${c}-2`}
              x1={c * CELL_SIZE + CAGE_PADDING}
              y1={r * CELL_SIZE}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

        // 6. Vẽ góc phần tư thứ hai nếu có neighbor trên và bên phải cùng cage
        if (
          adjacentCells.top &&
          adjacentCells.right &&
          !adjacentCells.topright
        ) {
          lines.push(
            <Line
              key={`top-right-corner-${r}-${c}`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={r * CELL_SIZE + CAGE_PADDING}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`top-right-corner-${r}-${c}-2`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={r * CELL_SIZE}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
        // 7. Vẽ góc phần tư thứ ba nếu có neighbor dưới và bên trái cùng cage
        if (
          adjacentCells.bottom &&
          adjacentCells.left &&
          !adjacentCells.bottomleft
        ) {
          lines.push(
            <Line
              key={`bottom-left-corner-${r}-${c}`}
              x1={c * CELL_SIZE}
              y1={(r + 1) * CELL_SIZE - CAGE_PADDING}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`bottom-left-corner-${r}-${c}-2`}
              x1={c * CELL_SIZE + CAGE_PADDING}
              y1={(r + 1) * CELL_SIZE}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
        // 8. Vẽ góc phần tư thứ tư nếu có neighbor dưới và bên phải cùng cage
        if (
          adjacentCells.bottom &&
          adjacentCells.right &&
          !adjacentCells.bottomright
        ) {
          lines.push(
            <Line
              key={`bottom-right-corner-${r}-${c}`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={(r + 1) * CELL_SIZE - CAGE_PADDING}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`bottom-right-corner-${r}-${c}-2`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={(r + 1) * CELL_SIZE}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
      }
    }

    return lines;
  };

  return (
    <Svg
      width={CELL_SIZE * BOARD_SIZE}
      height={CELL_SIZE * BOARD_SIZE}
      style={styles.cageBordersSvg}
      pointerEvents="none">
      {renderCageBorders()}
    </Svg>
  );
};

const styles = StyleSheet.create({
  cageBordersSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});

export const CageBorders = React.memo(CageBordersComponent);
