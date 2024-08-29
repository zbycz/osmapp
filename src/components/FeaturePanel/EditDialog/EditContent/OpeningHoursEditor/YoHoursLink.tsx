import { useEditContext } from '../../EditContext';
import { Typography } from '@mui/material';
import { encodeUrl } from '../../../../../helpers/utils';
import React from 'react';
import { t, Translation } from '../../../../../services/intl';

export const YoHoursLink = () => {
  const { tags } = useEditContext().tags;
  const url = encodeUrl`https://projets.pavie.info/yohours/?oh=${tags['opening_hours']}`;

  return (
    <Typography variant="body2" color="textSecondary">
      <Translation
        id="opening_hours.editor.visualize_in"
        tags={{
          link: `a href="${url}" target="_blank"`,
        }}
      />
    </Typography>
  );
};
