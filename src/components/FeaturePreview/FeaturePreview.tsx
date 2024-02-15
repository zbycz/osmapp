import React from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { getOsmappLink } from '../../services/helpers';
import Maki from '../utils/Maki';
import { getLabel } from '../../helpers/featureLabel';

const Wrapper = styled.div`
  position: absolute;
  z-index: 1200; // 1300 is mui-dialog
  bottom: 40px;
  left: 45%;
  max-width: 45vw;

  .MuiButtonBase-root {
    text-transform: none;
  }
`;

export const FeaturePreview = () => {
  const { preview, setPreview, setFeature } = useFeatureContext();

  if (!preview || preview.noPreviewButton) {
    return null;
  }

  const handleClick = () => {
    setPreview(null);
    setFeature({ ...preview, skeleton: true }); // skeleton needed so map doesnt move (Router will create new coordsFeature)
    Router.push(`${getOsmappLink(preview)}${window.location.hash}`); // this will create brand new coordsFeature()
  };

  const onClose = () => {
    setPreview(null);
  };

  return (
    <Wrapper>
      <Button
        color="primary"
        onClick={handleClick}
        variant="contained"
        startIcon={<Maki ico={preview.properties.class} invert />}
      >
        {getLabel(preview)}
      </Button>
      <ClosePanelButton
        onClick={onClose}
        right
        style={{ margin: '-6px -36px 0 0' }}
      />
    </Wrapper>
  );
};
