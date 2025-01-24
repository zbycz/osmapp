import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import { positionToDeg, positionToDM } from '../../../../utils';
import { useFeatureContext } from '../../../utils/FeatureContext';
import React from 'react';
import { ActionButtons } from './ActionButtons';
import styled from '@emotion/styled';
import { t } from '../../../../services/intl';
import { useMobileMode } from '../../../helpers';
import { OpenLocationCode } from 'open-location-code';
import { usePersistedState } from '../../../utils/usePersistedState';

const olc = new OpenLocationCode();

const useCoords = () => {
  const { feature } = useFeatureContext();
  const center = feature.roundedCenter ?? feature.center;

  return center
    ? {
        default: positionToDeg(center),
        dm: positionToDM(center),
        olc: olc.encode(center[1], center[0]),
      }
    : null;
};

const StyledSelect = styled(Select<string>)`
  font-family: monospace;
  font-size: 0.875rem;
`;

export const CoordinateSection = () => {
  const options = useCoords();
  const [selected, setSelected] = usePersistedState(
    'user.coords-format',
    'default',
  );

  const onChange = ({ target }) => {
    setSelected(target.value);
  };

  return (
    <Box mb={1}>
      <Typography variant="overline">{t('sharedialog.coordinates')}</Typography>
      <Stack
        spacing={0.5}
        sx={{
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <StyledSelect
          value={options ? selected : 'error'}
          onChange={onChange}
          fullWidth
          size={useMobileMode() ? 'small' : 'medium'}
        >
          {options ? (
            Object.keys(options).map((key) => (
              <MenuItem value={key} key={key}>
                {options[key]}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="error">
              Error: position `center` is missing, overpass broken?
            </MenuItem>
          )}
        </StyledSelect>
        <ActionButtons payload={options?.[selected]} type="text" />
      </Stack>
    </Box>
  );
};
