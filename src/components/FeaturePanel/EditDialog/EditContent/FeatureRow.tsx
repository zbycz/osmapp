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
import { NwrIcon } from '../../NwrIcon';
import { useEditContext } from '../context/EditContext';
import { useLoadingState } from '../../../utils/useLoadingState';
import { PoiIcon } from '../../../utils/icons/PoiIcon';
import { allPresets } from '../../../../services/tagging/data';
import { EditDataItem } from '../context/types';
import { isDesktop } from '../../../helpers';
import { findInItems } from '../context/utils';
import { getDifficulties } from '../../../../services/tagging/climbing/routeGrade';
import { ConvertedRouteDifficultyBadge } from '../../Climbing/ConvertedRouteDifficultyBadge';

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

const StyledPresetLabel = styled(Typography)`
  display: none;
  @media ${isDesktop} {
    display: block;
  }
`;

const getLabel = (dataItem: EditDataItem) => {
  if (dataItem) {
    const hasGrade = dataItem.tagsEntries.find(([k]) =>
      k.startsWith('climbing:grade:'),
    );
    const routeDifficulties = getDifficulties(dataItem.tags);
    return (
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        mr={1}
      >
        <Stack direction="column">
          <Typography>{dataItem.tags.name} </Typography>
          <StyledPresetLabel color="secondary" variant="caption">
            {dataItem.presetLabel}
          </StyledPresetLabel>
        </Stack>
        {hasGrade && (
          <ConvertedRouteDifficultyBadge
            routeDifficulties={routeDifficulties}
          />
        )}
      </Stack>
    );
  }
  return undefined;
};

const PoiIconForItem = ({ dataItem }: { dataItem: EditDataItem }) =>
  dataItem ? (
    <PoiIcon
      tags={allPresets[dataItem.presetKey]?.tags}
      size={16}
      middle
      themed
    />
  ) : (
    <StyledDownloadIcon color="secondary" />
  );

type Props = {
  shortId: string;
  onClick: (e: React.MouseEvent) => Promise<void>;
  originalLabel?: string;
  role?: string;
};

export const FeatureRow = ({
  shortId,
  onClick,
  originalLabel,
  role,
}: Props) => {
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const { items } = useEditContext();
  const dataItem = findInItems(items, shortId);
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
              <PoiIconForItem dataItem={dataItem} />
              {getLabel(dataItem) || originalLabel || shortId}
              <NwrIcon shortId={shortId} hideNode />
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
            <ChevronRightIcon color="primary" />
          )}
        </Stack>
      </StyledListItem>
      <StyledDivider />
    </>
  );
};
