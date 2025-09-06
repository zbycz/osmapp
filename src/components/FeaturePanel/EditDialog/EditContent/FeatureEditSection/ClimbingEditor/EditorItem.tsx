import { t } from '../../../../../../services/intl';
import { TranslationId } from '../../../../../../services/types';
import React, { useState } from 'react';
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
import { useCurrentItem } from '../../../context/EditContext';
import { Setter } from '../../../../../../types';

const getTranslationKey = (key: string) => {
  return key.replaceAll(':', '_').replace(/^climbing_/, '');
};

export const getLabel = (key: string) =>
  // TODO TranslationId should never be dynamic, see https://github.com/zbycz/osmapp/pull/1229/files#r2276510504
  t(`climbing_badges.${getTranslationKey(key)}_label` as TranslationId);

const getDescription = (key: string) =>
  t(`climbing_badges.${getTranslationKey(key)}_description` as TranslationId);

const getValue = (value: string | undefined) => {
  if (value === 'yes') return t('yes');
  if (value === 'no') return t('no');
  return t('editdialog.custom_value');
};

type CustomValueInputProps = {
  k?: string;
};

const CustomValueInput = ({ k }: CustomValueInputProps) => {
  const { tags, setTag } = useCurrentItem();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTag(k, value.trim() === '' ? undefined : value);
  };

  return (
    <Box mt={1} display="flex" alignItems="center" gap={1}>
      <Typography variant="caption" color="text.secondary">
        {t('editdialog.custom_value')}:
      </Typography>
      <TextField
        size="small"
        value={tags[k] ?? ''}
        onChange={onChange}
        sx={{ minWidth: 160 }}
      />
    </Box>
  );
};

const EditButton = (props: { onClick: () => void }) => (
  <IconButton size="small" onClick={props.onClick}>
    <EditIcon fontSize="small" />
  </IconButton>
);

const CloseButton = (props: { onClick: () => void }) => (
  <IconButton size="small" onClick={props.onClick}>
    <CloseIcon fontSize="small" />
  </IconButton>
);

const ToggleTagButton = ({ k }: { k: string }) => {
  const { tags, setTag } = useCurrentItem();
  const value = tags[k];
  const onSwitch = (checked: boolean) => setTag(k, checked ? 'yes' : 'no');

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Switch
        size="small"
        checked={value === 'yes' || (value && value !== 'no')}
        onChange={(e) => onSwitch(e.target.checked)}
      />
      <Typography variant="caption">{getValue(value)}</Typography>
    </Box>
  );
};

const TagLabel = ({ k }: { k: string }) => {
  const desc = getDescription(k);
  return (
    <>
      <Typography variant="body2" fontWeight="bold">
        {getLabel(k)}
      </Typography>
      {!!desc && (
        <Typography variant="caption" color="text.secondary">
          {desc}
        </Typography>
      )}
    </>
  );
};

type Props = {
  k: string;
  customValue: boolean;
  setVisible: Setter<string[]>;
};

export const EditorItem = ({ k, customValue, setVisible }: Props) => {
  const [showCustom, setShowCustom] = useState(false);
  const { tagsEntries, setTagsEntries } = useCurrentItem();

  const onRemove = () => {
    const index = tagsEntries.findIndex(([key]) => k === key);
    if (index !== -1) setTagsEntries((prev) => prev.toSpliced(index, 1));
    setVisible((prev) => prev.filter((key) => k !== key));
  };

  const toggleCustom = () => setShowCustom((prev) => !prev);

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box flex={1} mr={2}>
          <TagLabel k={k} />
          {customValue && showCustom && <CustomValueInput k={k} />}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <ToggleTagButton k={k} />

          {customValue && <EditButton onClick={toggleCustom} />}

          <CloseButton onClick={onRemove} />
        </Box>
      </Box>
    </Paper>
  );
};
