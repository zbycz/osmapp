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

// use memo for this function
export const convertGrade = (gradeTable, from, to, value) => {
  if (!from || !to || !value || !gradeTable?.[from]) return null;
  const indexInTable = gradeTable[from].indexOf(value);

  if (gradeTable[to][indexInTable]) return gradeTable[to][indexInTable];
  return null;
};
export const getDifficultyColor = (
  gradeTable: GradeTable,
  difficulty: RouteDifficulty,
) => {
  const DEFAULT_COLOR = 'black';
  if (!difficulty) return DEFAULT_COLOR;

  const uiaaGrade =
    difficulty.gradeSystem !== 'uiaa'
      ? convertGrade(
          gradeTable,
          difficulty.gradeSystem,
          'uiaa',
          difficulty.grade,
        )
      : difficulty.grade;
  return gradeColors[uiaaGrade] || DEFAULT_COLOR;
};

export const getRouteGrade = (
  gradeTable: GradeTable,
  grades: Partial<{ [key in `climbing:grade:${GradeSystem}`]: string }>,
  convertTo: GradeSystem,
) => {
  console.log('____///', getCsvGradeData());
  const availableGrades = Object.keys(grades);
  return availableGrades.reduce((convertedGrade, availableGrade) => {
    const convertFrom = availableGrade.split(':').pop();
    const value = grades[availableGrade];
    const grade = convertGrade(gradeTable, convertFrom, convertTo, value);
    if (grade) return grade;
    return convertedGrade;
    // const indexInTable = gradeTable[convertFrom].indexOf(value);
    // console.log(
    //   '________',
    //   convertFrom,
    //   value,
    //   indexInTable,
    //   gradeTable[convertFrom],
    //   gradeTable[convertTo],
    //   gradeTable[convertTo][indexInTable],
    // );
    // if (gradeTable[convertTo][indexInTable])
    //   return gradeTable[convertTo][indexInTable];
    // return convertedGrade;
  }, null);
};

// getRouteGrade(
//   {
//     'climbing:grade:uiaa': '6+',
//     'climbing:grade:french': '7a',
//   },
//   'saxon',
// );

// getRouteGrade(
//   {
//     'climbing:grade:uiaa': '6+',
//     'climbing:grade:french': '7a',
//   },
//   'uiaa',
// );

export const getCragGrade = () => {};

// getCragGrade({
//   "climbing:grade:uiaa:mi"n: "6",
//   "climbing:grade:french:min": "6a",
//   "climbing:grade:french:max": "7a",
// }, "saxon"): "VII - VIII"

// getCragGrade({
//   "climbing:grade:uia"a: "6",
//   "climbing:grade:french:min": "6a",
//   "climbing:grade:french:max": "7a",
// }, "french"): "VII - VIII"
