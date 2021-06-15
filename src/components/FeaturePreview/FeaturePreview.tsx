import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { getOsmappLink } from '../../services/helpers';
import Maki from '../utils/Maki';

const Wrapper = styled.div`
  position: absolute;
  z-index: 2000;
  bottom: 30px;
  left: 50%;
  margin-left: -70px;

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
    Router.push(getOsmappLink(preview)); // this will create brand new coordsFeature()
  };

  const onClose = () => {
    setPreview(null);
  };

  const label =
    preview.tags.name ||
    preview.properties.class?.replace(/_/g, ' ') ||
    preview.osmMeta.type;
  const icon = <Maki ico={preview.properties.class} invert />;

  return (
    <Wrapper>
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
    </Wrapper>
  );
};
