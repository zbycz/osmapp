import React from 'react';
import zip from 'lodash/zip';
import { GRADE_TABLE } from '../utils/grades/gradeData';
import { useTheme } from '@emotion/react';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { getDifficultyColor } from '../utils/grades/routeGrade';
import { convertHexToRgba } from '../../../utils/colorUtils';
import { RouteDifficultyBadge } from '../RouteDifficultyBadge';
import { GRADE_SYSTEMS } from '../../../../services/tagging/climbing';

type BodyProps = {
  columns: string[];
};

/**
 * Returns an object where each key is a visible gradeSystemKey and the value is an
 * array of the same length as the transposed table.  Each element contains the
 * grade text and the rowSpan it should occupy (0 for rows that are merged into
 * the cell above).
 */
const useMergedCells = (columns: string[], transposedTable: string[][]) => {
  return React.useMemo(() => {
    const result: Record<string, { grade: string; rowSpan: number }[]> = {};

    columns.forEach((gradeSystemKey) => {
      const originalIndex = GRADE_SYSTEMS.findIndex(
        (g) => g.key === gradeSystemKey,
      );
      const colGrades = transposedTable.map((row) => row[originalIndex]);
      const merged: { grade: string; rowSpan: number }[] = [];

      let i = 0;
      while (i < colGrades.length) {
        let j = i + 1;
        while (j < colGrades.length && colGrades[j] === colGrades[i]) j += 1;
        const span = j - i;
        merged.push({ grade: colGrades[i], rowSpan: span });
        for (let k = i + 1; k < j; k += 1) {
          merged.push({ grade: colGrades[i], rowSpan: 0 });
        }
        i = j;
      }
      result[gradeSystemKey] = merged;
    });

    return result;
  }, [columns, transposedTable]);
};

export const ClimbingGradesTableBody = ({ columns }: BodyProps) => {
  const [clickedItem, setClickedItem] = React.useState<{
    row?: number;
    column?: number;
  }>({});
  const transposedTable = zip(...Object.values(GRADE_TABLE)) as string[][];

  const mergedCells = useMergedCells(columns, transposedTable);
  const theme = useTheme();

  return (
    <TableBody>
      {transposedTable.map((_, rowIdx) => (
        <TableRow
          key={`row-${rowIdx}`}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          {columns.map((key, colIdx) => {
            const cell = mergedCells[key][rowIdx];
            if (cell.rowSpan === 0) return null; // merged into previous cell
            const routeDifficulty = {
              grade: cell.grade,
              gradeSystem: key,
            };
            const colorByDifficulty = getDifficultyColor(
              routeDifficulty,
              theme,
            );

            return (
              <TableCell
                key={`cell-${rowIdx}-${key}`}
                rowSpan={cell.rowSpan}
                onClick={() =>
                  setClickedItem(
                    clickedItem.row === rowIdx && clickedItem.column === colIdx
                      ? { row: null, column: null }
                      : { row: rowIdx, column: colIdx },
                  )
                }
                sx={{
                  backgroundColor:
                    clickedItem.row === null ||
                    clickedItem.column === null ||
                    clickedItem.row === rowIdx ||
                    (rowIdx <= clickedItem.row &&
                      rowIdx + cell.rowSpan - 1 >= clickedItem.row) ||
                    clickedItem.column === colIdx
                      ? colorByDifficulty
                      : convertHexToRgba(colorByDifficulty, 0.3),
                  borderRight: `4px solid ${theme.palette.background.default} !important`,
                  borderBottom: `4px solid ${theme.palette.background.default} !important`,
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              >
                <RouteDifficultyBadge routeDifficulty={routeDifficulty} />
              </TableCell>
            );
          })}
          <TableCell sx={{ width: '100%' }} />
        </TableRow>
      ))}
    </TableBody>
  );
};
