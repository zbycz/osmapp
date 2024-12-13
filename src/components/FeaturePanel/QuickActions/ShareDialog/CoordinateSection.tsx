import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import { positionToDeg, positionToDM } from '../../../../utils';
import { useFeatureContext } from '../../../utils/FeatureContext';
import React from 'react';
import { ActionButtons } from './ActionButtons';
import styled from '@emotion/styled';
import { t } from '../../../../services/intl';
import { useMobileMode } from '../../../helpers';
import { encode } from 'open-location-code';

const useCoords = () => {
  const { feature } = useFeatureContext();
  const center = feature.roundedCenter ?? feature.center;

  return {
    deg: positionToDeg(center),
    dm: positionToDM(center),
    olc: encode(center[1], center[0]),
  };
};

const StyledSelect = styled(Select<string>)`
  font-family: monospace;
  font-size: 0.875rem;
`;

export const CoordinateSection = () => {
  const { deg, dm, olc } = useCoords();
  const [selected, setSelected] = React.useState(deg);

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
          value={selected}
          onChange={onChange}
          fullWidth
          size={useMobileMode() ? 'small' : 'medium'}
        >
          <MenuItem value={deg}>{deg}</MenuItem>
          <MenuItem value={dm}>{dm}</MenuItem>
          <MenuItem value={olc}>{olc}</MenuItem>
        </StyledSelect>
        <ActionButtons payload={selected} type="text" />
      </Stack>
    </Box>
  );
};
