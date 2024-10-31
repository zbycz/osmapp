import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import { t } from '../../../services/intl';
import { useStarsContext } from '../../utils/StarsContext';
import { useIsClient } from '../../helpers';

const StyledActionButton = styled(IconButton)<{ $color?: string }>`
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#fff' : '#000')};
  }
  /* Used to overwrite pointer-events: none from the collapsed featurepanel drawer */
  pointer-events: all;
`;

const StarButtonPure = ({ isStarred, toggleStar }) => (
  <StyledActionButton onClick={toggleStar}>
    {isStarred ? (
      <Tooltip arrow title={t('featurepanel.favorites_unsave_button')}>
        <Star />
      </Tooltip>
    ) : (
      <Tooltip arrow title={t('featurepanel.favorites_save_button')}>
        <StarBorder />
      </Tooltip>
    )}
  </StyledActionButton>
);

export const StarButton = () => {
  const { toggleStar, isStarred } = useStarsContext();
  const isClient = useIsClient(); // SSR doesn't know localStorage, so it would end with hydrationWarning

  return (
    <>
      {isClient ? (
        <StarButtonPure isStarred={isStarred} toggleStar={toggleStar} />
      ) : (
        <StarButtonPure isStarred={false} toggleStar={() => {}} />
      )}
    </>
  );
};
