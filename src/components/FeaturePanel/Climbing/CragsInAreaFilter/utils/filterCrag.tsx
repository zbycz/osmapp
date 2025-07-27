import {
  convertGrade,
  getDifficulty,
  isInGradeInterval,
} from '../../../../../services/tagging/climbing/routeGrade';
import { GradeSystem } from '../../../../../services/tagging/climbing/gradeSystems';
import { Feature } from '../../../../../services/types';

type Props = {
  gradeInterval: [number, number] | null;
  currentGradeSystem: GradeSystem;
  grades: string[];
  minimumRoutesInInterval: number;
  isDefaultFilter: boolean;
};

export const filterCrag =
  ({
    gradeInterval,
    currentGradeSystem,
    grades,
    minimumRoutesInInterval,
    isDefaultFilter,
  }: Props) =>
  (crag: Feature) => {
    if (!gradeInterval || isDefaultFilter) return true;

    const numberOfFilteredRoutes = crag.memberFeatures.reduce((acc, route) => {
      const difficulty = getDifficulty(route.tags);
      if (!difficulty) return acc;
      const convertedGrade = convertGrade(
        difficulty.gradeSystem,
        currentGradeSystem,
        difficulty.grade,
      );
      if (
        isInGradeInterval({
          gradeMin: grades[gradeInterval[0]],
          gradeMax: grades[gradeInterval[1]],
          grade: convertedGrade,
          currentGradeSystem,
        })
      )
        return acc + 1;
      return acc;
    }, 0);

    return numberOfFilteredRoutes > minimumRoutesInInterval;
  };
