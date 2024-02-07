import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import React from 'react';
import { t } from '../../../services/intl';
import { useStarsContext } from '../../utils/StarsContext';
import { StyledActionButton } from './utils';

export const StarButton = () => {
  const { toggleStar, isStarred } = useStarsContext();

  return (
    <StyledActionButton onClick={toggleStar}>
      {isStarred ? (
        <Star
          htmlColor="#fff"
          titleAccess={t('featurepanel.favorites_save_button')}
        />
      ) : (
        <StarBorder
          htmlColor="#fff"
          titleAccess={t('featurepanel.favorites_unsave_button')}
        />
      )}
    </StyledActionButton>
  );
};
