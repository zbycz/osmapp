import { DialogContent } from '@mui/material';
import React from 'react';
import { FeatureTypeSelect } from './FeatureTypeSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OtherTagsEditor } from './OtherTagsEditor';
import { EditDialogActions } from './EditDialogActions';
import { OptionsEditor } from './OptionsEditor';
import { CommentField } from './CommentField';
import { OsmLogin } from './OsmLogin';
import { ContributionInfoBox } from './ContributionInfoBox';

export const EditContent = () => (
  <>
    <DialogContent dividers>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        {false && <FeatureTypeSelect />}
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
