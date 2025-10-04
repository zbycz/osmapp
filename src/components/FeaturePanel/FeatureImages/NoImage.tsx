import React from 'react';
import styled from '@emotion/styled';
import { grey } from '@mui/material/colors';
import { useFeatureContext } from '../../utils/FeatureContext';
import { IMAGE_HEIGHT } from './helpers';
import { iconsLookup } from '../../utils/icons/iconsLookup';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${IMAGE_HEIGHT}px;
  background: ${({ theme }) =>
    theme.palette.mode === 'dark' ? grey['700'] : grey['100']};

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
    color: #eee;
    opacity: 0.15;
  }
`;

export const NoImage = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;
  const ico = properties.class;
  const icon = iconsLookup.includes(ico) ? ico : 'information';

  return (
    <Wrapper>
      <img src={`/icons/${icon}_11.svg`} alt={ico} title={ico} />
    </Wrapper>
  );
};
