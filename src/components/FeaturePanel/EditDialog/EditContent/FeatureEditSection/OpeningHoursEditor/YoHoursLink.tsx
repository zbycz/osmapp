import { Typography } from '@mui/material';
import { encodeUrl } from '../../../../../../helpers/utils';
import React from 'react';
import { Translation } from '../../../../../../services/intl';
import { useCurrentItem } from '../../../context/EditContext';

export const YoHoursLink = () => {
  const { tags } = useCurrentItem();
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
