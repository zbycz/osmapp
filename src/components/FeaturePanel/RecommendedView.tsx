import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useFeatureContext } from '../utils/FeatureContext';
import { getGlobalMap } from '../../services/mapStorage';
import isNumber from 'lodash/isNumber';
import { t } from '../../services/intl';

const SubtleButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  padding: '4px 8px',
  margin: '4px 0',
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.primary,
  },
}));

export const RecommendedView = () => {
  const { feature } = useFeatureContext();
  return (
    <SubtleButton
      onClick={() => {
        const { landmarkView } = feature;
        const { zoom, pitch, bearing } = landmarkView;
        const [lng, lat] = feature.center;
        // flyTo breaks the map
        getGlobalMap()?.jumpTo({
          center: { lng, lat },
          ...(isNumber(zoom) ? { zoom } : {}),
          ...(isNumber(pitch) ? { pitch } : {}),
          ...(isNumber(bearing) ? { bearing } : {}),
        });
      }}
    >
      {t('featurepanel.recommended_view')}
    </SubtleButton>
  );
};
