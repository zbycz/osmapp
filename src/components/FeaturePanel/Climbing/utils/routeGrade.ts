import { useTheme } from '@mui/material';
import { GradeSystem, GradeTable, RouteDifficulty } from '../types';
import { gradeColors, gradeSystem, gradeTableString } from './gradeData';

const csvToArray = (csv: string) => {
  const rows = csv.split('\n');
  // const heading = rows[0];
  // const description = rows[1];
  const data = rows.slice(2);
  return data.map((dataRow) => {
    const rowDifficulties = dataRow.split(',');
    return rowDifficulties.map((difficulty) => difficulty.trimStart().trim());
  });
};

export const transposeArrays = (t: Array<Array<any>>) =>
  t[0].map((_, colIndex) => t.map((row) => row[colIndex]));

export const getCsvGradeData = () => {
  const transposedTable = transposeArrays(csvToArray(gradeTableString));

  const table = transposedTable.reduce((acc, row, index) => {
    if (!gradeSystem[index]) return acc;
    return {
      ...acc,
      [gradeSystem[index].key]: row,
    };
  }, {});
  return table;
};

export const exportGradeDataToWikiTable = () => {
  const csvArray = csvToArray(gradeTableString);
  const data = csvArray.map((row) => `|${row.join('\n|')}`).join('\n|-\n');

  return data;
};

// @TODO use memo for this function?
export const convertGrade = (
  gradeTable: GradeTable,
  from: GradeSystem,
  to: GradeSystem,
  value: string,
) => {
  if (!from || !to || !value || !gradeTable?.[from]) return null;
  const indexInTable = gradeTable[from].indexOf(value);

  if (gradeTable[to][indexInTable]) return gradeTable[to][indexInTable];
  return null;
};
export const getDifficultyColor = (
  gradeTable: GradeTable,
  difficulty: RouteDifficulty,
) => {
  const DEFAULT_COLOR = '#555';
  if (!difficulty) return DEFAULT_COLOR;
  const theme = useTheme();
  const { mode } = theme.palette;
  const uiaaGrade =
    difficulty.gradeSystem !== 'uiaa'
      ? convertGrade(
          gradeTable,
          difficulty.gradeSystem,
          'uiaa',
          difficulty.grade,
        )
      : difficulty.grade;
  return gradeColors[uiaaGrade]?.[mode] || DEFAULT_COLOR;
};

export const getRouteGrade = (
  gradeTable: GradeTable,
  grades: Partial<{ [key in `climbing:grade:${GradeSystem}`]: string }>,
  convertTo: GradeSystem,
) => {
  const availableGrades = Object.keys(grades);
  return availableGrades.reduce((convertedGrade, availableGrade) => {
    const convertFrom = availableGrade.split(':').pop();
    const value = grades[availableGrade];
    const grade = convertGrade(gradeTable, convertFrom, convertTo, value);
    if (grade) return grade;
    return convertedGrade;
  }, null);
};

export const getGradeSystemName = (gradeSystemKey: GradeSystem) =>
  gradeSystem.find((item) => item.key === gradeSystemKey)?.name;

export const getOsmTagFromGradeSystem = (gradeSystemKey: GradeSystem) =>
  `climbing:grade:${gradeSystemKey}`;
