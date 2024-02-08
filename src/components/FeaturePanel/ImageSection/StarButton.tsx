import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import React, { useEffect, useState } from 'react';
import { t } from '../../../services/intl';
import { useStarsContext } from '../../utils/StarsContext';
import { StyledActionButton } from './utils';

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};

const StarButtonPure = ({ isStarred, toggleStar }) => (
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
