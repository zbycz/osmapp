import React from 'react';
import styled from 'styled-components';
import { IconButton, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { usePersistedState } from '../../utils/usePersistedState';
import { ClimbingLegend } from './ClimbingLegend';
import { convertHexToRgba } from '../../utils/colorUtils';
import { AttributionLinks } from './AttributionLinks';
import { useMapStateContext } from '../../utils/MapStateContext';
import { useIsClient, useMobileMode } from '../../helpers';
import { useFeatureContext } from '../../utils/FeatureContext';

const IconContainer = styled.div`
  width: 20px;
  height: 20px;
`;

const StyledIconButton = styled(IconButton)`
  position: relative;
  top: -5px;
`;

const FooterContainer = styled.div<{ $hasShadow: boolean }>`
  margin: 0 4px 4px 4px;
  pointer-events: all;
  border-radius: 8px;
  padding: 6px;
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.5)};
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  ${({ $hasShadow }) =>
    $hasShadow ? 'box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);' : ''}
`;

const Wrapper = styled.div`
  padding: 0 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.primary};
  font-weight: 400;
  text-align: left;
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.palette.text.primary};
    text-decoration: underline;
  }
`;

const LegendExpandButton = ({ isVisible, setLegendShown }) => (
  <IconContainer>
    {isVisible && (
      <Tooltip title="Show climbing legend" enterDelay={1000}>
        <StyledIconButton
          size="small"
          edge="end"
          onClick={() => {
            setLegendShown(true);
          }}
        >
          <KeyboardArrowUpIcon fontSize="small" />
        </StyledIconButton>
      </Tooltip>
    )}
  </IconContainer>
);

export const MapFooter = () => {
  const { activeLayers } = useMapStateContext();
  const isMobileMode = useMobileMode();
  const { featureShown } = useFeatureContext();
  const hasClimbingLayer = activeLayers.includes('climbing');
  const hasLegend = isMobileMode && featureShown ? false : hasClimbingLayer;
  const [legendShown, setLegendShown] = usePersistedState<boolean>(
    'isLegendVisible',
    true,
  );
  const isClient = useIsClient();

  if (!isClient) {
    // TODO find a way how to render this in SSR (keep layer in cookies?)
    return null;
  }

  return (
    <FooterContainer $hasShadow={hasLegend && legendShown}>
      {hasLegend && (
        <ClimbingLegend
          isVisible={legendShown}
          setLegendShown={setLegendShown}
        />
      )}
      <Wrapper>
        <AttributionLinks />
        {hasLegend && (
          <LegendExpandButton
            isVisible={!legendShown}
            setLegendShown={setLegendShown}
          />
        )}
      </Wrapper>
    </FooterContainer>
  );
};
