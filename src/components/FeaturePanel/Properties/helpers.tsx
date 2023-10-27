import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { t } from '../../../services/intl';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import React from 'react';

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
