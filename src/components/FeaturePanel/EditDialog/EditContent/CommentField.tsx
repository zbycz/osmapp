import { useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useEditContext } from '../context/EditContext';
import { t } from '../../../../services/intl';

export const CommentField = () => {
  const { comment, setComment } = useEditContext();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  return (
    <>
      <FormControlLabel
        control={<Checkbox size="small" />}
        onChange={() => setIsCommentVisible(!isCommentVisible)}
        label={
          <Typography variant="body2">
            {t('editdialog.comment_checkbox')}
          </Typography>
        }
      />
      {isCommentVisible && (
        <TextField
          sx={{ mt: 1, mb: 1 }}
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
      )}
    </>
  );
};
