import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { t } from '../../../../../../services/intl';

export const EditorHeader: React.FC<{
  label: string;
  inactive: string[];
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ label, onClick }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Typography variant="body1">• {label}</Typography>
    <Button variant="text" size="small" onClick={onClick}>
      {t('editdialog.add_value')}
    </Button>
  </Box>
);
