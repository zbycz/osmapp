import { ClimbingGuideInfo } from './ClimbingGuideInfo';
import { PROJECT_ID } from '../../../services/project';
import { useMobileMode } from '../../helpers';

export const FeaturePanelClimbingGuideInfo = () => {
  const isOpenClimbing = PROJECT_ID === 'openclimbing';
  const isMobileMode = useMobileMode();

  if (!isOpenClimbing || isMobileMode) {
    return null;
  }

  return <ClimbingGuideInfo />;
};
