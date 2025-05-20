import { DialogContent, Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { TestApiWarning } from '../../helpers/TestApiWarning';
import { ItemsTabs } from './ItemsTabs';
import { ItemEditSection } from './ItemEditSection';

const Wrapper: React.FC = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Stack
      direction={isSmallScreen ? 'column' : 'row'}
      gap={1}
      overflow="hidden"
      flex={1}
      sx={{ borderTop: `solid 1px ${theme.palette.divider}` }}
    >
      {children}
    </Stack>
  );
};

export const EditContent = () => {
  return (
    <>
      <Wrapper>
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
                <ItemEditSection />
              </Stack>
              <CommentField />
              <ContributionInfoBox />
              <OsmUserLogged />
              <TestApiWarning />
            </Stack>
          </form>
        </DialogContent>
      </Wrapper>
      <EditDialogActions />
    </>
  );
};
