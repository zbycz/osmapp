import { IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import styled from 'styled-components';

const StyledToggleButton = styled(IconButton)`
  position: absolute !important;
  margin: -11px 0 0 0 !important;
`;

export const ToggleButton = ({ onClick, isShown }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {!isShown && <ExpandMoreIcon fontSize="small" />}
    {isShown && <ExpandLessIcon fontSize="small" />}
  </StyledToggleButton>
);
