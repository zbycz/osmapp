import { DialogContent } from '@mui/material';
import React from 'react';
import { FeatureTypeSelect } from './FeatureTypeSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { CommentField, ContributionInfoBox, OsmLogin } from '../components';
import { OtherTagsEditor } from '../OtherTagsEditor';
import { EditDialogActions } from './EditDialogActions';
import { OptionsEditor } from './OptionsEditor';

export const EditContent = () => (
  <>
    <DialogContent dividers>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <FeatureTypeSelect />
        <MajorKeysEditor />
        <OptionsEditor />
        <ContributionInfoBox />
        <CommentField />
        <OtherTagsEditor />
        <OsmLogin />
      </form>
    </DialogContent>
    <EditDialogActions />
  </>
);
