import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { t } from '../../../services/intl';
import { useStarsContext } from '../../utils/StarsContext';
import { useUserThemeContext } from '../../../helpers/theme';
import { useIsClient } from '../../helpers';

const StyledActionButton = styled(IconButton)<{ $color?: string }>`
  svg {
    width: 20px;
    height: 20px;
    color: ${({ $color }) => $color || '#fff'};
  }
`;

const StarButtonPure = ({ isStarred, toggleStar }) => {
  const { currentTheme } = useUserThemeContext();
  const color = currentTheme === 'dark' ? '#fff' : '#000';

  return (
    <StyledActionButton onClick={toggleStar} $color={color}>
      {isStarred ? (
        <Tooltip arrow title={t('featurepanel.favorites_unsave_button')}>
          <Star htmlColor={color} />
        </Tooltip>
      ) : (
        <Tooltip arrow title={t('featurepanel.favorites_save_button')}>
          <StarBorder htmlColor={color} />
        </Tooltip>
      )}
    </StyledActionButton>
  );
};

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
