import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { roundedToDegUrl } from '../../utils';

const Wrapper = styled.div`
  position: absolute;
  z-index: 2000;
  bottom: 30px;
  left: 50%;
  margin-left: -70px;
`;

export const FeaturePreview = () => {
  const { preview, setPreview, setFeature } = useFeatureContext();

  if (!preview) {
    return null;
  }

  const handleClick = () => {
    setPreview(null);
    setFeature({ ...preview, skeleton: true }); // needed so map doesnt move (Router will create new coordsFeature)
    Router.push(`/${roundedToDegUrl(preview.roundedCenter)}`);
  };

  const onClose = () => {
    setPreview(null);
  };

  return (
    <Wrapper>
      <Button color="primary" onClick={handleClick} variant="contained">
        {preview.tags.name}
      </Button>
      <ClosePanelButton
        onClick={onClose}
        right
        style={{ margin: '-6px -36px 0 0' }}
      />
    </Wrapper>
  );
};
