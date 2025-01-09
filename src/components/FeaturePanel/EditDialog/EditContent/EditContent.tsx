import {
  DialogContent,
  Stack,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { FeatureEditSection } from './FeatureEditSection/FeatureEditSection';
import { useEditDialogFeature } from '../utils';
import { useEditContext } from '../EditContext';
import { getShortId } from '../../../../services/helpers';
import { fetchSchemaTranslations } from '../../../../services/tagging/translations';
import { TestApiWarning } from '../../helpers/TestApiWarning';

export const EditContent = () => {
  const { items, addFeature, current, setCurrent } = useEditContext();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      <DialogContent dividers>
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <OsmUserLoggedOut />
          <Stack direction={isSmallScreen ? 'column' : 'row'} gap={2}>
            {items.length > 1 && (
              <Tabs
                orientation={isSmallScreen ? 'horizontal' : 'vertical'}
                variant={isSmallScreen ? 'scrollable' : 'standard'}
                value={current}
                onChange={(
                  _event: React.SyntheticEvent,
                  newShortId: string,
                ) => {
                  setCurrent(newShortId);
                }}
                sx={{
                  borderRight: isSmallScreen ? 0 : 1,
                  borderBottom: isSmallScreen ? 1 : 0,
                  borderColor: 'divider',
                  '&& .MuiTab-root': {
                    alignItems: isSmallScreen ? undefined : 'baseline',
                    textAlign: isSmallScreen ? undefined : 'left',
                  },
                }}
              >
                {items.map(({ shortId, tags }, idx) => (
                  <Tab key={idx} label={tags.name ?? shortId} value={shortId} />
                ))}
              </Tabs>
            )}
            <div>
              <FeatureEditSection shortId={current} />
              <CommentField />
              <ContributionInfoBox />
              <OsmUserLogged />
              <TestApiWarning />
            </div>
          </Stack>
        </form>
      </DialogContent>
      <EditDialogActions />
    </>
  );
};
