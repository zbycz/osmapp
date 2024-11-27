import { DialogContent } from '@mui/material';
import React from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { FeatureEditSection } from './FeatureEditSection/FeatureEditSection';
import { useEditDialogFeature } from '../utils';

export const EditContent = () => {
  const { feature } = useEditDialogFeature(); //TODO temporary

  return (
    <>
      <DialogContent dividers>
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <OsmUserLoggedOut />
          <FeatureEditSection featureId={feature.osmMeta} />
          <ContributionInfoBox />
          <CommentField />
          <OsmUserLogged />
        </form>
      </DialogContent>
      <EditDialogActions />
    </>
  );
};
