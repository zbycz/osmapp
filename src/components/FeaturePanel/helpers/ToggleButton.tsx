import { IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import styled from '@emotion/styled';

const StyledToggleButton = styled(IconButton)`
  margin: -7px 0 -7px 10px;
`;

export const ToggleButton = ({ onClick, isShown }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {!isShown && <ExpandMoreIcon fontSize="small" />}
    {isShown && <ExpandLessIcon fontSize="small" />}
  </StyledToggleButton>
);
