import { ClimbingGuideInfo } from './ClimbingGuideInfo';
import { useFeatureContext } from '../../utils/FeatureContext';
import { climbingTagValues } from './utils/climbingTagValues';

export const FeaturePanelClimbingGuideInfo = () => {
  const { feature } = useFeatureContext();

  const isClimbing = climbingTagValues.includes(feature.tags.climbing);

  if (!isClimbing) {
    return null;
  }

  return <ClimbingGuideInfo />;
};
