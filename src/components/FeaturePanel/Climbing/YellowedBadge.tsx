import React from 'react';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import { useClimbingContext } from './contexts/ClimbingContext';
import { getShortId } from '../../../services/helpers';
import { useTicksContext } from '../../utils/TicksContext';

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
  const { isTicked } = useTicksContext();
  const { routes } = useClimbingContext();
  const isVisible =
    routes.length > 0 &&
    routes.every((route) => {
      const osmId = getShortId(route.feature?.osmMeta) ?? null;
      return isTicked(osmId);
    });

  return isVisible ? (
    <Container>
      <CheckIcon fontSize="small" />
      <Text>Vyžluceno</Text>
    </Container>
  ) : null;
};
