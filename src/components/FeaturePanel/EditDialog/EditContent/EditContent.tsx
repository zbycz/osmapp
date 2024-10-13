import { DialogContent } from '@mui/material';
import React from 'react';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OtherTagsEditor } from './OtherTagsEditor';
import { EditDialogActions } from './EditDialogActions';
import { OptionsEditor } from './OptionsEditor';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';

export const EditContent = () => (
  <>
    <DialogContent dividers>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <OsmUserLoggedOut />
        <MajorKeysEditor />
        <OptionsEditor />
        <ContributionInfoBox />
        <CommentField />
        <OtherTagsEditor />
        <OsmUserLogged />
      </form>
    </DialogContent>
    <EditDialogActions />
  </>
);
