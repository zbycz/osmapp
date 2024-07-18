import { TextField } from '@mui/material';
import React from 'react';
import { useEditContext } from '../EditContext';
import { t } from '../../../../services/intl';

export const CommentField = () => {
  const { comment, setComment } = useEditContext();
  return (
    <>
      <TextField
        label={t('editdialog.comment')}
        placeholder={t('editdialog.comment_placeholder')}
        InputLabelProps={{
          shrink: true,
        }}
        multiline
        fullWidth
        rows={2}
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <br />
      <br />
      <br />
    </>
  );
};
