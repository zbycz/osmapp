import React from 'react';
import { useMapStateContext } from '../../utils/MapStateContext';
import { usePersistedState } from '../../utils/usePersistedState';
import styled from '@emotion/styled';
import { IconButton, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ClimbingLegend } from './ClimbingLegend';
import { AttributionLinks } from './AttributionLinks';
import { useIsClient, useMobileMode } from '../../helpers';
import { useFeatureContext } from '../../utils/FeatureContext';

const IconContainer = styled.div<{ $isVisible: boolean }>`
  width: ${({ $isVisible }) => ($isVisible ? '20px' : '0')};
  height: 20px;
  transition: width 0.15s ease-out;
  margin-left: -4px;
  margin-right: 4px;
`;

const StyledIconButton = styled(IconButton)`
  position: relative;
  top: -5px;
`;

const FooterContainer = styled.div<{ $legendShown: boolean }>`
  pointer-events: all;
  border-radius: 8px;
  padding: 1px 4px;
  color: rgba(0, 0, 0, 0.8);
  background-color: rgba(250, 250, 250, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  margin-top: 4px;
`;

const Wrapper = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 400;
  text-align: left;
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: space-between;

  a {
    color: rgba(0, 0, 0, 0.8);
    text-decoration: underline;
  }
`;

const LegendExpandButton = ({ isVisible, setLegendShown }) => (
  <IconContainer $isVisible={isVisible}>
    {isVisible && (
      <Tooltip title="Show climbing legend" enterDelay={1000}>
        <StyledIconButton
          size="small"
          edge="end"
          color="inherit"
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
    <>
      {hasLegend && (
        <ClimbingLegend
          isVisible={legendShown}
          setLegendShown={setLegendShown}
        />
      )}
      <FooterContainer $legendShown={hasLegend && legendShown}>
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
    </>
  );
};
