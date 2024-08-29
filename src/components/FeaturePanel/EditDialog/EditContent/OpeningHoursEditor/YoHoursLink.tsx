import { useEditContext } from '../../EditContext';
import { Typography } from '@mui/material';
import { encodeUrl } from '../../../../../helpers/utils';
import React from 'react';
import { t } from '../../../../../services/intl';

export const YoHoursLink = () => {
  const {
    tags: { tags },
  } = useEditContext();

  return (
    <Typography variant="body2" color="textSecondary">
      {t('opening_hours.editor.visualize_in')}{' '}
      <a
        href={encodeUrl`https://projets.pavie.info/yohours/?oh=${tags['opening_hours']}`}
        title={tags['opening_hours']}
      >
        {t('opening_hours.editor.yohours_tool')}
      </a>
      .
    </Typography>
  );
};
