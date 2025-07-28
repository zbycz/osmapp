import { getGradeIndexFromTags } from '../../../../../services/tagging/climbing/routeGrade';
import { Feature } from '../../../../../services/types';
import { useFeatureContext } from '../../../../utils/FeatureContext';
import { useUserSettingsContext } from '../../../../utils/userSettings/UserSettingsContext';

const useGetMemberCrags = () => {
  const { feature } = useFeatureContext();
  return feature.memberFeatures.filter(({ tags }) => tags.climbing === 'crag');
};

export const useGetFilteredCrags = (): Feature[] => {
  const crags = useGetMemberCrags();
  const { climbingFilter } = useUserSettingsContext();
  const { gradeInterval, minimumRoutes, isDefaultFilter } = climbingFilter;
  const [minIndex, maxIndex] = gradeInterval;

  if (isDefaultFilter) {
    return crags;
  }

  return crags.filter((crag) => {
    const routes = crag.memberFeatures;
    const filteredRoutes = routes
      .map((route) => getGradeIndexFromTags(route.tags))
      .filter((gradeIndex) => gradeIndex >= minIndex && gradeIndex <= maxIndex);

    return filteredRoutes.length >= minimumRoutes;
  });
};
