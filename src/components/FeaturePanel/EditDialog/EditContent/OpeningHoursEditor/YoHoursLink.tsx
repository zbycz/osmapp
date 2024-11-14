import { useEditContext } from '../../EditContext';
import { Typography } from '@mui/material';
import { encodeUrl } from '../../../../../helpers/utils';
import React from 'react';
import { t, Translation } from '../../../../../services/intl';

export const YoHoursLink = () => {
  const { tags } = useEditContext().data;
  const url = encodeUrl`https://projets.pavie.info/yohours/?oh=${tags['opening_hours']}`;

  return (
    <Typography variant="body2" color="textSecondary">
      <Translation
        id="opening_hours.editor.create_advanced"
        tags={{
          link: `a href="${url}" target="_blank"`,
        }}
      />
    </Typography>
  );
};
