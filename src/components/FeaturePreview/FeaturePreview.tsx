import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { getOsmappLink } from '../../services/helpers';
import Maki from '../utils/Maki';
import { getNameOrFallback } from '../../utils';

const Wrapper = styled.div`
  position: absolute;
  z-index: 1200; // 1300 is mui-dialog
  bottom: 40px;
  left: 50%;
  //margin-left: -70px;

  & > div {
    position: relative;
    left: -50%;
  }

  .MuiButtonBase-root {
    text-transform: none;
  }
`;

export const FeaturePreview = () => {
  const { preview, setPreview, setFeature } = useFeatureContext();

  if (!preview) {
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

  const icon = <Maki ico={preview.properties.class} invert />;
  const label = getNameOrFallback(preview);

  return (
    <Wrapper>
      <div>
        <Button
          color="primary"
          onClick={handleClick}
          variant="contained"
          startIcon={icon}
        >
          {label}
        </Button>
        <ClosePanelButton
          onClick={onClose}
          right
          style={{ margin: '-6px -36px 0 0' }}
        />
      </div>
    </Wrapper>
  );
};
