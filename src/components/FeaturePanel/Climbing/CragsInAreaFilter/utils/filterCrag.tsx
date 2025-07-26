import {
  convertGrade,
  getDifficulty,
  isInGradeInterval,
} from '../../../../../services/tagging/climbing/routeGrade';

export const filterCrag =
  ({
    gradeInterval,
    currentGradeSystem,
    uniqueValues,
    minimumRoutesInInterval,
    isTouched,
  }) =>
  (crag) => {
    if (!gradeInterval || !isTouched) return true;

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
          gradeMin: uniqueValues[gradeInterval[0]],
          gradeMax: uniqueValues[gradeInterval[1]],
          grade: convertedGrade,
          currentGradeSystem,
        })
      )
        return acc + 1;
      return acc;
    }, 0);
    return numberOfFilteredRoutes > minimumRoutesInInterval;
  };
