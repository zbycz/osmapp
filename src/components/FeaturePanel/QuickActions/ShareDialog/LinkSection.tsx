import { useState } from 'react';
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
import { QrCode } from './QrCode';
import { PROJECT_ID } from '../../../../services/project';

const getProjectLogo = () => {
  if (PROJECT_ID === 'openclimbing') {
    return '/openclimbing/logo/openclimbing_64.png';
  }
  return '/osmapp/logo/osmapp_64.png';
};

const useProjectLink = (short: boolean) => {
  const { feature } = useFeatureContext();
  return short ? getShortLink(feature) : getFullOsmappLink(feature);
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
  const link = useProjectLink(short);

  return (
    <>
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
      <QrCode payload={link} image={getProjectLogo()} />
    </>
  );
};
