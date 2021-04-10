import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { useToggleState } from '../../helpers';
import { Feature } from '../../../services/types';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OtherTagsEditor } from './OtherTagsEditor';
import {
  ChangeLocationEditor,
  ContributionInfoBox,
  NoteField,
  OtherOptionsHeading,
  PlaceCancelledToggle,
} from './components';

interface Props {
  feature: Feature;
  open: boolean;
  handleClose: () => void;
  focusTag: boolean | string;
}

const useIsFullScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

export const EditDialog = ({ feature, open, handleClose, focusTag }: Props) => {
  const { tags, properties } = feature;
  const fullScreen = useIsFullScreen();
  const [placeCanceled, togglePlaceCanceled] = useToggleState(false);
  const [location, setLocation] = React.useState('');
  const [note, setNote] = React.useState('');
  const [values, setValues] = React.useState(tags);
  const setValue = (k, v) => setValues((state) => ({ ...state, [k]: v }));

  const saveDialog = () => {
    // eslint-disable-next-line no-alert
    alert('TODO');
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
        <MajorKeysEditor
          values={values}
          setValue={setValue}
          focusTag={focusTag}
        />
        <OtherOptionsHeading />
        <OtherTagsEditor
          values={values}
          setValue={setValue}
          focusTag={focusTag}
        />
        <PlaceCancelledToggle
          placeCanceled={placeCanceled}
          togglePlaceCanceled={togglePlaceCanceled}
        />
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
