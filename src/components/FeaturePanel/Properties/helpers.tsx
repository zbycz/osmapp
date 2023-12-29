import styled from 'styled-components';
import { Button } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React from 'react';
import { t } from '../../../services/intl';

const StyledToggleButton = styled(Button)`
  svg {
    font-size: 17px;
  }
`;

export const ShowMoreButton = ({ onClick, isShown }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {!isShown && (
      <>
        {t('show_more')} <ChevronRight fontSize="small" />
      </>
    )}
    {isShown && (
      <>
        {t('show_less')} <ExpandLessIcon fontSize="small" />
      </>
    )}
  </StyledToggleButton>
);
