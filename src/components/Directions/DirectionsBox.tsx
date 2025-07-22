import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { Result } from './Result';
import { RoutingResult } from './routing/types';
import { isTabletResolution, useBoolState, useMobileMode } from '../helpers';
import { DirectionsForm } from './DirectionsForm';
import { useDirectionsContext } from './DirectionsContext';

const Wrapper = styled(Stack, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobileMode: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 1101; // over the LayerSwitcherButton and FeaturePanel
  max-height: calc(100vh - 16px);
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);

  @media ${isTabletResolution} {
    max-width: 394px;
  }
`;

export const DirectionsBox = () => {
  const isMobileMode = useMobileMode();
  const { setResult, result } = useDirectionsContext();

  const [revealed, revealForm, hide] = useBoolState(true); // mobile only
  const hideForm = isMobileMode && result && !revealed;

  const setResultAndHide = useCallback(
    (result: RoutingResult) => {
      setResult(result);
      hide();
    },
    [hide, setResult],
  );

  return (
    <Wrapper spacing={1} $isMobileMode={isMobileMode}>
      <DirectionsForm setResult={setResultAndHide} hideForm={hideForm} />
      {result && <Result revealForm={!revealed && revealForm} />}
    </Wrapper>
  );
};
