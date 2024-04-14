import React from 'react';
import styled from 'styled-components';
import CheckIcon from '@material-ui/icons/Check';
import { useClimbingContext } from './contexts/ClimbingContext';
import { isTicked } from './utils/ticks';

const Text = styled.div``;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 22px;
  align-items: center;
  padding: 2px 8px;
  background-color: ${({ theme }) => theme.palette.climbing.tick};
  font-size: 13px;
  font-weight: 900;
  gap: 4px;
`;

export const YellowedBadge = () => {
  const { routes } = useClimbingContext();
  const isVisible = routes.every((route) => {
    const osmId = route.feature?.osmMeta.id ?? null;
    return isTicked(osmId);
  });

  return isVisible ? (
    <Container>
      <CheckIcon fontSize="small" />
      <Text>Vyžluceno</Text>
    </Container>
  ) : null;
};
