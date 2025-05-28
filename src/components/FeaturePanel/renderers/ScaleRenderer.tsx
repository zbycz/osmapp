import React from 'react';
import styled from '@emotion/styled';
import { t } from '../../../services/intl';

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const Circle = styled.div<{ $color: string }>`
  border-radius: 12px;
  padding: 2px 8px;
  background-color: ${({ $color }) => $color};
  display: inline-block;
  font-size: 13px;
  font-weight: 900;
  color: ${({ theme, $color }) => theme.palette.getContrastText($color)};
  font-family: monospace;
`;

// TODO perhaps merge with ClimbingGradeRenderer in future
export const ScaleRenderer = ({ k, v }) => {
  const label =
    k === 'via_ferrata_scale'
      ? t('climbing_renderer.via_ferrata_scale')
      : k === 'sac_scale'
        ? t('climbing_renderer.sac_scale')
        : k;

  return (
    <Container>
      <Circle $color="#555">{v}</Circle>
      <span>{label}</span>
    </Container>
  );
};
