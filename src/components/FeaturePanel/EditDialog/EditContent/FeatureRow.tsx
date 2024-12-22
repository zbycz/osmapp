import { Divider, ListItem, ListItemText, Stack } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';

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
          <ListItemText>{label ?? shortId}</ListItemText>
          <ChevronRightIcon />
        </Stack>
      </ListItem>
      <Divider />
    </>
  );
};
