import { RouteDifficulty } from '../../types';
import {
  csvToArray,
  GRADE_SYSTEMS,
  GRADE_TABLE,
  gradeColors,
  GradeSystem,
  gradeTableString,
} from './gradeData';
import { FeatureTags } from '../../../../../services/types';

export const exportGradeDataToWikiTable = () => {
  const csvArray = csvToArray(gradeTableString);
  return csvArray.map((row) => `|${row.join('\n|')}`).join('\n|-\n');
};

// @TODO use memo for this function?
export const convertGrade = (
  from: GradeSystem,
  to: GradeSystem,
  value: string,
) => {
  if (!from || !to || !value || !GRADE_TABLE[from]) return null;
  const indexInTable = GRADE_TABLE[from].indexOf(value);

  if (GRADE_TABLE[to][indexInTable]) {
    return GRADE_TABLE[to][indexInTable];
  }
  return null;
};

export const getDifficulty = (
  tags: FeatureTags,
): RouteDifficulty | undefined => {
  if (!tags) {
    return undefined;
  }

  const gradeKeys = Object.keys(tags).filter((key) =>
    key.startsWith('climbing:grade'),
  );

  if (gradeKeys.length) {
    const key = gradeKeys[0]; // @TODO store all found grades
    const system = key.split(':', 3)[2];

    return {
      gradeSystem: (system ?? 'uiaa') as GradeSystem, // @TODO `gradeSystem` type should be `string`
      grade: tags[key],
    };
  }

  return undefined;
};

export const getDifficultyColor = (tags: FeatureTags, theme) => {
  const difficulty = getDifficulty(tags);

  const DEFAULT_COLOR = '#555';
  if (!difficulty) {
    return DEFAULT_COLOR;
  }
  const { mode } = theme.palette;
  const uiaaGrade =
    difficulty.gradeSystem !== 'uiaa'
      ? convertGrade(difficulty.gradeSystem, 'uiaa', difficulty.grade)
      : difficulty.grade;
  return gradeColors[uiaaGrade]?.[mode] || DEFAULT_COLOR;
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
  }, null);
};

export const getGradeSystemName = (gradeSystemKey: GradeSystem) =>
  GRADE_SYSTEMS.find((item) => item.key === gradeSystemKey)?.name;

export const getOsmTagFromGradeSystem = (gradeSystemKey: GradeSystem) =>
  `climbing:grade:${gradeSystemKey}`;
