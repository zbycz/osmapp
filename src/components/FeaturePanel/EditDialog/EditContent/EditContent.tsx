import { DialogContent, Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { TestApiWarning } from '../../helpers/TestApiWarning';
import { ItemsTabs } from './ItemsTabs';
import { ItemHeading } from './FeatureEditSection/ItemHeading';
import { PresetSelect } from './FeatureEditSection/PresetSelect/PresetSelect';
import { MajorKeysEditor } from './FeatureEditSection/MajorKeysEditor';
import { TagsEditor } from './FeatureEditSection/TagsEditor/TagsEditor';
import { LocationEditor } from './FeatureEditSection/LocationEditor/LocationEditor';
import { ParentsEditor } from './FeatureEditSection/ParentsEditor';
import { MembersEditor } from './FeatureEditSection/MembersEditor';

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

const ItemSection = () => (
  <>
    <ItemHeading />
    <PresetSelect />
    <MajorKeysEditor />
    <TagsEditor />
    <LocationEditor />
    <ParentsEditor />
    <MembersEditor />
  </>
);

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
                <ItemSection />
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
