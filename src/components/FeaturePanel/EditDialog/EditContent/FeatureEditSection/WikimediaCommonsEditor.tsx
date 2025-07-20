import { useCurrentItem } from '../../EditContext';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import { TextFieldWithCharacterCount } from './helpers';
import { t } from '../../../../../services/intl';
import OpenInNew from '@mui/icons-material/OpenInNew';
import React from 'react';
import { useEditDialogContext } from '../../../helpers/EditDialogContext';

const UploadButton = () => (
  <div>
    <Tooltip
      arrow
      title={t('editdialog.upload_photo_tooltip')}
      enterDelay={1000}
    >
      <Button
        variant="text"
        color="primary"
        onClick={() => {}}
        endIcon={<OpenInNew />}
        target="_blank"
        href="https://commons.wikimedia.org/wiki/Special:UploadWizard"
      >
        {t('editdialog.upload_photo')}
      </Button>
    </Tooltip>
  </div>
);

const isWikimediaCommonsFileNameInvalid = (value: string) => {
  const regex = /^File:.+\.[a-zA-Z0-9_]+$/;
  return value && !regex.test(value);
};

const getIndexFromWikimediaCommonsKey = (key: string): number | undefined => {
  const parts = key.split(':');
  if (parts[0] === 'wikimedia_commons' && parts.length > 1) {
    return parseInt(parts[1], 10);
  }
  return undefined;
};

export const WikimediaCommonsEditor = ({ k }: { k: string }) => {
  const { focusTag } = useEditDialogContext();
  const { tags, setTag } = useCurrentItem();

  const error = isWikimediaCommonsFileNameInvalid(tags[k]);
  const index = getIndexFromWikimediaCommonsKey(k);
  const label = `${t('tags.wikimedia_commons_photo')}${index ? ` (${index})` : ''}`;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(
      e.target.name,
      e.target.value
        .replace(/^https:\/\/commons\.wikimedia\.org\/wiki\//, '')
        .replaceAll('_', ' '),
    );
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box flex={1}>
        <TextFieldWithCharacterCount
          label={label}
          helperText={
            error ? t('editdialog.upload_photo_filename_error') : undefined
          }
          error={error}
          k={k}
          autoFocus={focusTag === k}
          placeholder="File:Photo example.jpg (or paste URL)"
          onChange={onChange}
          value={tags[k] ?? ''}
        />
      </Box>
      <UploadButton />
    </Stack>
  );
};
