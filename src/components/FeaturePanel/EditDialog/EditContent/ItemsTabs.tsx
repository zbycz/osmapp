import styled from '@emotion/styled';
import {
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEditContext } from '../context/EditContext';
import React from 'react';
import { NwrIcon } from '../../NwrIcon';
import { EditDataItem } from '../context/types';
import WarningIcon from '@mui/icons-material/Warning';

const StyledTypography = styled(Typography, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $deleted: boolean }>`
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;

const StyledTabs = styled(Tabs)`
  border-color: ${({ theme }) => theme.palette.divider};
  && .MuiTab-root {
    text-align: left;
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
    resize: horizontal;
    min-width: 120px;
    max-width: 50%;

    .MuiTab-root {
      align-items: baseline;
      border-bottom: solid 1px ${({ theme }) => theme.palette.divider};
    }
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    .MuiTab-root {
      align-items: center;
    }
  }
`;

const ModifiedBadge = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

const StyledWarningIcon = styled(WarningIcon)`
  font-size: 15px;
`;

const WarningBadge = ({ item }: { item: EditDataItem }) => {
  const { validate } = useEditContext();
  return validate &&
    item.shortId[0] === 'n' &&
    item.nodeLonLat === undefined ? (
    <StyledWarningIcon color="warning" />
  ) : null;
};

type TabLabelProps = {
  item: EditDataItem;
};

const TabLabel = ({ item }: TabLabelProps) => {
  const { shortId, tags, presetLabel, toBeDeleted, modified } = item;

  return (
    <>
      {modified && <ModifiedBadge />}
      <Stack direction="column" alignItems="flex-start" width="100%">
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <WarningBadge item={item} />
          <StyledTypography
            variant="button"
            whiteSpace="nowrap"
            $deleted={toBeDeleted}
          >
            {tags.name || shortId}
          </StyledTypography>
        </Stack>
        <Typography
          variant="caption"
          textTransform="lowercase"
          whiteSpace="nowrap"
        >
          {presetLabel} <NwrIcon shortId={shortId} hideNode />
        </Typography>
      </Stack>
    </>
  );
};

export const ItemsTabs = () => {
  const { items, current, setCurrent } = useEditContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {items.length > 1 && (
        <StyledTabs
          orientation={isSmallScreen ? 'horizontal' : 'vertical'}
          variant="scrollable"
          value={current}
          onChange={(_event: React.SyntheticEvent, newShortId: string) => {
            setCurrent(newShortId);
          }}
        >
          {items.map((item, idx) => (
            <Tab
              key={idx}
              label={<TabLabel item={item} />}
              value={item.shortId}
              sx={{
                maxWidth: '100%',
                ...(isSmallScreen
                  ? {}
                  : { borderBottom: `solid 1px ${theme.palette.divider}` }),
              }}
            />
          ))}
        </StyledTabs>
      )}
    </>
  );
};
