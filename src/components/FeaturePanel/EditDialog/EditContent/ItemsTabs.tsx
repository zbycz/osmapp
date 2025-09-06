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
import { EditDataItem } from '../context/useEditItems';
import { getOsmTypeFromShortId, NwrIcon } from '../../NwrIcon';

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

type TabLabelProps = {
  item: EditDataItem;
};

const TabLabel = ({
  item: { shortId, tags, presetLabel, toBeDeleted, modified },
}: TabLabelProps) => (
  <>
    {modified && <ModifiedBadge />}
    <Stack direction="column" alignItems="flex-start" width="100%">
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
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
        {presetLabel}{' '}
        {shortId[0] === 'n' ? null : (
          <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
        )}
      </Typography>
    </Stack>
  </>
);

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
