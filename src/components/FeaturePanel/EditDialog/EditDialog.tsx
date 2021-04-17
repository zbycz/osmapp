import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { useToggleState } from '../../helpers';
import { Feature, FeatureTags } from '../../../services/types';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OtherTagsEditor } from './OtherTagsEditor';
import {
  ChangeLocationEditor,
  ContributionInfoBox,
  NoteField,
  OtherOptionsHeading,
  PlaceCancelledToggle,
} from './components';

const useIsFullScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

const useTagsState = (
  initialTags: FeatureTags,
): [FeatureTags, (k: string, v: string) => void] => {
  const [tags, setTags] = useState(initialTags);
  const setTag = (k, v) => setTags((state) => ({ ...state, [k]: v }));
  return [tags, setTag];
};

const createNote = () => {
  alert('TODO');
};

interface Props {
  feature: Feature;
  open: boolean;
  handleClose: () => void;
  focusTag: boolean | string;
}

export const EditDialog = ({ feature, open, handleClose, focusTag }: Props) => {
  const { properties } = feature;
  const fullScreen = useIsFullScreen();
  const [cancelled, toggleCancelled] = useToggleState(false);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTag] = useTagsState(feature.tags);

  const saveDialog = () => {
    createNote(feature, tags, cancelled, location, note);
    handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-dialog-title"
    >
      <DialogTitle id="edit-dialog-title">
        Navrhnout úpravu: {tags.name || properties.subclass}
      </DialogTitle>
      <DialogContent dividers>
        <MajorKeysEditor tags={tags} setTag={setTag} focusTag={focusTag} />
        <OtherOptionsHeading />
        <OtherTagsEditor tags={tags} setTag={setTag} focusTag={focusTag} />
        <PlaceCancelledToggle cancelled={cancelled} toggle={toggleCancelled} />
        <ChangeLocationEditor location={location} setLocation={setLocation} />
        <ContributionInfoBox />
        <NoteField note={note} setNote={setNote} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Zrušit
        </Button>
        <Button onClick={saveDialog} color="primary" variant="contained">
          Uložit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
