import {
  CircularProgress,
  Divider,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DownloadIcon from '@mui/icons-material/Download';
import styled from '@emotion/styled';
import React from 'react';
import { getOsmTypeFromShortId, NwrIcon } from '../../NwrIcon';
import { useEditContext } from '../context/EditContext';
import { useLoadingState } from '../../../utils/useLoadingState';

const StyledListItem = styled(ListItem)`
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.hover};
    cursor: pointer;
  }
`;

const StyledDivider = styled(Divider)`
  &:last-of-type {
    border: none;
  }
`;

const StyledDownloadIcon = styled(DownloadIcon)`
  font-size: 18px;
`;

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
              <Typography>{label || shortId}</Typography>
              <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
              {role && (
                <>
                  <div style={{ flex: '1' }} />
                  <Typography variant="caption">{role}</Typography>
                </>
              )}
            </Stack>
          </ListItemText>
          {isLoading ? (
            <CircularProgress size={14} />
          ) : (
            <>
              {!isAlreadyInItems ? (
                <StyledDownloadIcon color="secondary" />
              ) : null}
              <ChevronRightIcon color="primary" />
            </>
          )}
        </Stack>
      </StyledListItem>
      <StyledDivider />
    </>
  );
};
