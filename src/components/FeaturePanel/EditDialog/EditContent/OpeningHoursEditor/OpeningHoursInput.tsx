import { useEditDialogContext } from '../../../helpers/EditDialogContext';
import { useEditContext } from '../../EditContext';
import { TextField } from '@mui/material';
import { t } from '../../../../../services/intl';
import { encodeUrl } from '../../../../../helpers/utils';
import React from 'react';

export const OpeningHoursInput = () => {
  const { focusTag } = useEditDialogContext();
  const {
    tags: { tags, setTag },
  } = useEditContext();

  return (
    <TextField
      label={t('tags.opening_hours')}
      value={tags.opening_hours}
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      margin="normal"
      onChange={(e) => setTag('opening_hours', e.target.value)}
      fullWidth
      autoFocus={focusTag === 'opening_hours'}
      helperText={
        <>
          {t('opening_hours.editor.cant_edit_here')}{' '}
          <a
            href={encodeUrl`https://projets.pavie.info/yohours/?oh=${tags['opening_hours']}`}
            title={tags['opening_hours']}
          >
            {t('opening_hours.editor.yohours_tool')}
          </a>
          .
        </>
      }
    />
  );
};
