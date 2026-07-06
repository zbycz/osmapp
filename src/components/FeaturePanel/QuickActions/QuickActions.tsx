import styled from '@emotion/styled';
import DirectionsIcon from '@mui/icons-material/Directions';
import { QuickActionButton } from './QuickActionButton';
import { StarButton } from './StarButton';
import Router from 'next/router';
import { ShareButton } from './ShareDialog/ShareButton';
import { t } from '../../../services/intl';
import { useFeatureContext } from '../../utils/FeatureContext';
import { buildDirectionsUrl } from '../../Directions/helpers';
import { getDirectionsCoordsOption } from '../../SearchBox/options/coords';
import { getLabel } from '../../../helpers/featureLabel';
import { getLastMode } from '../../Directions/routing/handleRouting';

const Wrapper = styled.div`
  max-width: 100%;
  width: fit-content;
  margin-top: 24px;

  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Used to overwrite pointer-events: none from the collapsed featurepanel drawer */
  pointer-events: all;
`;

const Container = styled.div`
  width: max-content;
  display: flex;
  gap: 8px;
`;

export const QuickActions = () => {
  const { feature } = useFeatureContext();

  const handleDirections = () => {
    if (feature?.center) {
      const mode = getLastMode() || 'car';
      const toOption = getDirectionsCoordsOption(feature.center, getLabel(feature));
      Router.push(buildDirectionsUrl(mode, toOption));
    } else {
      Router.push('/directions');
    }
  };

  return (
    <Wrapper>
      <Container>
        <QuickActionButton
          icon={DirectionsIcon}
          label={t('featurepanel.directions_button')}
          onClick={handleDirections}
        />
        <StarButton />
        <ShareButton />
      </Container>
    </Wrapper>
  );
};
