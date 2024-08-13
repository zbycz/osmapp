import React from 'react';
import styled from '@emotion/styled';
import { grey } from '@mui/material/colors';
import { useFeatureContext } from '../../utils/FeatureContext';
import { HEIGHT } from './helpers';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${HEIGHT}px;
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
  return (
    <Wrapper>
      <img src={`/icons/${ico}_11.svg`} alt={ico} title={ico} />
    </Wrapper>
  );
};
