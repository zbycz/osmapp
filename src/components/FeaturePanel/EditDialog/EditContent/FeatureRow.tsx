import {
  Divider,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';
import { getOsmTypeFromShortId, NwrIcon } from '../../NwrIcon';

export const FeatureRow = ({ label, shortId, onClick }) => {
  return (
    <>
      <ListItem onClick={onClick}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          width="100%"
        >
          <ListItemText>
            <Stack direction="row" gap={2} alignItems="center">
              <Typography>{label ?? shortId}</Typography>
              <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
            </Stack>
          </ListItemText>
          <ChevronRightIcon />
        </Stack>
      </ListItem>
      <Divider />
    </>
  );
};
