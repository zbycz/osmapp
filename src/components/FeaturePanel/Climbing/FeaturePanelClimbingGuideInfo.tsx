import { ClimbingGuideInfo } from './ClimbingGuideInfo';
import { PROJECT_ID } from '../../../services/project';

export const FeaturePanelClimbingGuideInfo = () => {
  const isOpenClimbing = PROJECT_ID === 'openclimbing';

  if (!isOpenClimbing) {
    return null;
  }

  return <ClimbingGuideInfo />;
};
