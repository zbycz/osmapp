import { useState, useEffect } from 'react';
import React from 'react';
import { getFullOsmappLink, getShortLink } from '../../../../services/helpers';
import { useFeatureContext } from '../../../utils/FeatureContext';
import styled from '@emotion/styled';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ActionButtons } from './ActionButtons';
import { t } from '../../../../services/intl';
import { useMobileMode } from '../../../helpers';
import { Setter } from '../../../../types';

const useLink = (short: boolean) => {
  const { feature } = useFeatureContext();
  const [link, setLink] = useState(
    short ? getShortLink(feature) : getFullOsmappLink(feature),
  );

  useEffect(() => {
    const url = short ? getShortLink(feature) : getFullOsmappLink(feature);
    setLink(url);
  }, [short, feature]);
  return link;
};

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    font-family: monospace;
    font-size: 0.875rem;
  }
`;

type ShortenCheckboxProps = {
  short: boolean;
  setShort: Setter<boolean>;
};
const ShortenCheckbox = ({ short, setShort }: ShortenCheckboxProps) => {
  const handleClick = ({ target }) => {
    setShort(target.checked);
  };

  return (
    <FormControlLabel
      control={<Checkbox checked={short} onChange={handleClick} size="small" />}
      label={t('sharedialog.shortened_link')}
      sx={{
        paddingLeft: 1,
        '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
      }}
    />
  );
};

export const LinkSection = () => {
  const { feature } = useFeatureContext();
  const supportsShortUrl = !feature.point;
  const [short, setShort] = useState(false);
  const link = useLink(short);

  return (
    <Box mb={2}>
      <Typography variant="overline">{t('sharedialog.link')}</Typography>
      <Stack spacing={0}>
        <StyledTextField
          fullWidth
          value={link}
          variant="outlined"
          size={useMobileMode() ? 'small' : 'medium'}
        />
        <Stack direction="row" alignItems="center">
          {supportsShortUrl && (
            <ShortenCheckbox short={short} setShort={setShort} />
          )}
          <div style={{ flex: 1 }} />

          <ActionButtons payload={link} type="url" />
        </Stack>
      </Stack>
    </Box>
  );
};
