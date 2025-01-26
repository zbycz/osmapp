import { ClimbingGuideInfo } from './ClimbingGuideInfo';
import { useFeatureContext } from '../../utils/FeatureContext';

export const FeaturePanelClimbingGuideInfo = () => {
  const { feature } = useFeatureContext();

  if (
    !['crag', 'area', 'route', 'route_bottom', 'route_top'].includes(
      feature.tags.climbing,
    )
  ) {
    return null;
  }

  return <ClimbingGuideInfo />;
};
