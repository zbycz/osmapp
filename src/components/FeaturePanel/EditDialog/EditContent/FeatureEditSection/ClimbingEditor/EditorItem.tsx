import { t } from '../../../../../../services/intl';
import { TranslationId } from '../../../../../../services/types';
import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const getTranslationKey = (key: string) => {
  return key.replaceAll(':', '_').replace(/^climbing_/, '');
};

// TODO TranslationId should never be dynamic, see https://github.com/zbycz/osmapp/pull/1229/files#r2276510504
export const getLabel = (key: string) =>
  t(`climbing_badges.${getTranslationKey(key)}_label` as TranslationId);

const getDescription = (key: string) =>
  t(`climbing_badges.${getTranslationKey(key)}_description` as TranslationId);

export const EditorItem: React.FC<{
  k: string;
  value: string | undefined;
  editable: boolean;
  isEditing: boolean;
  onEditToggle: () => void;
  onSwitch: (checked: boolean) => void;
  onRemove: () => void;
  onCustomChange: (val: string) => void;
}> = ({
  k,
  value,
  editable,
  isEditing,
  onEditToggle,
  onSwitch,
  onRemove,
  onCustomChange,
}) => {
  const desc = getDescription(k);

  const getValue = (value: string | undefined) => {
    if (value === 'yes') return t('yes');
    if (value === 'no') return t('no');
    return t('editdialog.custom_value');
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box flex={1} mr={2}>
          <Typography variant="body2" fontWeight="bold">
            {getLabel(k)}
          </Typography>
          {!!desc && (
            <Typography variant="caption" color="text.secondary">
              {desc}
            </Typography>
          )}
          {editable && isEditing && (
            <Box mt={1} display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary">
                {t('editdialog.custom_value')}:
              </Typography>
              <TextField
                size="small"
                value={value ?? ''}
                onChange={(e) => onCustomChange(e.target.value)}
                sx={{ minWidth: 160 }}
              />
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Switch
              size="small"
              checked={value === 'yes'}
              onChange={(e) => onSwitch(e.target.checked)}
            />
            <Typography variant="caption">{getValue(value)}</Typography>
          </Box>

          {editable && (
            <IconButton size="small" onClick={onEditToggle}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" onClick={onRemove}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};
