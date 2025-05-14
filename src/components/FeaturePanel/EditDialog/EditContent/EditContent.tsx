import { DialogContent, Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { ItemEditSection } from './FeatureEditSection/ItemEditSection';
import { useEditContext } from '../EditContext';
import { TestApiWarning } from '../../helpers/TestApiWarning';
import { ItemsTabs } from './ItemsTabs';

export const EditContent = () => {
  const { current } = useEditContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Stack
        direction={isSmallScreen ? 'column' : 'row'}
        gap={1}
        overflow="hidden"
        flex={1}
        sx={{ borderTop: `solid 1px ${theme.palette.divider}` }}
      >
        <ItemsTabs />
        <DialogContent dividers sx={{ flex: 1, borderTop: 0 }}>
          <form
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            style={{ height: '100%' }}
          >
            <OsmUserLoggedOut />

            <Stack height="100%">
              <Stack flex={1}>
                <ItemEditSection shortId={current} />
              </Stack>
              <CommentField />
              <ContributionInfoBox />
              <OsmUserLogged />
              <TestApiWarning />
            </Stack>
          </form>
        </DialogContent>
      </Stack>
      <EditDialogActions />
    </>
  );
};
