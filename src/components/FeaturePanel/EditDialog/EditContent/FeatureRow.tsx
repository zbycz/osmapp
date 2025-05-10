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
import { useEditContext } from '../EditContext';

type Props = {
  label?: string;
  shortId: string;
  onClick: (e: React.MouseEvent) => void;
};

export const FeatureRow = ({ label, shortId, onClick }: Props) => {
  const { items } = useEditContext();
  const isAlreadyInItems = items.find((item) => item.shortId === shortId);

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
              <Typography color={isAlreadyInItems ? 'secondary' : undefined}>
                {label ?? shortId}
              </Typography>
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
