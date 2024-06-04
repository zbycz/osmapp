import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import React from 'react';
import { Tooltip } from '@material-ui/core';
import { t } from '../../../services/intl';
import { useStarsContext } from '../../utils/StarsContext';
import { StyledActionButton } from './utils';
import { useUserThemeContext } from '../../../helpers/theme';
import { useIsClient } from '../../helpers';

const StarButtonDarkPure = ({ isStarred, toggleStar }) => (
  <StyledActionButton onClick={toggleStar}>
    {isStarred ? (
      <Tooltip arrow title={t('featurepanel.favorites_unsave_button')}>
        <Star htmlColor="#fff" />
      </Tooltip>
    ) : (
      <Tooltip arrow title={t('featurepanel.favorites_save_button')}>
        <StarBorder htmlColor="#fff" />
      </Tooltip>
    )}
  </StyledActionButton>
);

export const StarButtonDark = () => {
  const { toggleStar, isStarred } = useStarsContext();
  const isClient = useIsClient(); // SSR doesn't know localStorage, so it would end with hydrationWarning

  return (
    <>
      {isClient ? (
        <StarButtonDarkPure isStarred={isStarred} toggleStar={toggleStar} />
      ) : (
        <StarButtonDarkPure isStarred={false} toggleStar={() => {}} />
      )}
    </>
  );
};

const StarButtonPure = ({ isStarred, toggleStar }) => {
  const { currentTheme } = useUserThemeContext();
  const color = currentTheme === 'dark' ? '#fff' : '#000';

  return (
    <StyledActionButton onClick={toggleStar} color={color}>
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
