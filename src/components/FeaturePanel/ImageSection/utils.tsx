import { IconButton } from '@mui/material';
import styled from 'styled-components';

export const StyledActionButton = styled(IconButton)<{ $color?: string }>`
  svg {
    width: 20px;
    height: 20px;
    color: ${({ $color }) => $color || '#fff'};
  }
`;
