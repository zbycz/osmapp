import { DialogContent } from '@mui/material';
import React from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { FeatureEditSection } from './FeatureEditSection/FeatureEditSection';

export const EditContent = () => (
  <>
    <DialogContent dividers>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <OsmUserLoggedOut />
        <FeatureEditSection />
        <ContributionInfoBox />
        <CommentField />
        <OsmUserLogged />
      </form>
    </DialogContent>
    <EditDialogActions />
  </>
);
