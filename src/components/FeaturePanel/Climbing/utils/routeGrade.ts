import { GradeSystem, gradeTable } from './gradeTable';

export const convertGrade = (from, to, value) => {
  if (!from || !to || !value || !gradeTable[from]) return null;
  // console.log('___from', from, to, value);
  const indexInTable = gradeTable[from].indexOf(value);

  if (gradeTable[to][indexInTable]) return gradeTable[to][indexInTable];
  return null;
};

export const getRouteGrade = (
  grades: Partial<{ [key in `climbing:grade:${GradeSystem}`]: string }>,
  convertTo: GradeSystem,
) => {
  const availableGrades = Object.keys(grades);
  return availableGrades.reduce((convertedGrade, availableGrade) => {
    const convertFrom = availableGrade.split(':').pop();
    const value = grades[availableGrade];
    const grade = convertGrade(convertFrom, convertTo, value);
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
