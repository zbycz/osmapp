import {
  CircularProgress,
  Divider,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { getOsmTypeFromShortId, NwrIcon } from '../../NwrIcon';
import { useEditContext } from '../EditContext';
import { useBoolState } from '../../../helpers';

const useLoadingState = () => {
  const [isLoading, start, stop] = useBoolState(false);
  const timeout = React.useRef<NodeJS.Timeout>();
  return {
    isLoading,
    startLoading: useCallback(() => {
      timeout.current = setTimeout(start, 300);
    }, [start]),
    stopLoading: useCallback(() => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }
      stop();
    }, [stop]),
  };
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  ':hover': {
    backgroundColor: theme.palette.background.hover,
    cursor: 'pointer',
  },
}));

type Props = {
  label?: string;
  shortId: string;
  onClick: (e: React.MouseEvent) => Promise<void>;
  role?: string;
};

export const FeatureRow = ({ label, shortId, onClick, role }: Props) => {
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const { items } = useEditContext();
  const isAlreadyInItems = items.find((item) => item.shortId === shortId);

  const handleClick = (e: React.MouseEvent) => {
    startLoading();
    onClick(e).then(() => {
      stopLoading();
    });
  };

  return (
    <>
      <StyledListItem onClick={handleClick}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          width="100%"
        >
          <ListItemText>
            <Stack direction="row" gap={2} alignItems="center">
              <Typography color={isAlreadyInItems ? 'secondary' : undefined}>
                {label || shortId}
              </Typography>
              <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
              {role && (
                <>
                  <div style={{ flex: '1' }} />
                  <Typography variant="caption">{role}</Typography>
                </>
              )}
            </Stack>
          </ListItemText>
          {isLoading ? <CircularProgress size={14} /> : <ChevronRightIcon />}
        </Stack>
      </StyledListItem>
      <Divider />
    </>
  );
};
