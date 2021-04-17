import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import DialogContent from '@material-ui/core/DialogContent';
import { CircularProgress } from '@material-ui/core';
import { useToggleState } from '../../helpers';
import { Feature, FeatureTags } from '../../../services/types';
import { createNote } from './createNote';
import { insertOsmNote } from '../../../services/osmApi';
import { MajorKeysEditor } from './MajorKeysEditor';
import {
  ChangeLocationEditor,
  ContributionInfoBox,
  NoteField,
  DialogHeading,
  PlaceCancelledToggle,
} from './components';
import { OtherTagsEditor } from './OtherTagsEditor';
import { SuccessContent } from './SuccessContent';
import { icons } from '../../../assets/icons';

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

interface Props {
  feature: Feature;
  open: boolean;
  handleClose: () => void;
  focusTag: boolean | string;
}

export const EditDialog = ({ feature, open, handleClose, focusTag }: Props) => {
  const fullScreen = useIsFullScreen();
  const [cancelled, toggleCancelled] = useToggleState(false);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTag] = useTagsState(feature.tags);
  const [loading, setLoading] = useState(false);
  const [insertedNote, setInsertedNote] = useState<
    false | { text: string; url: string }
  >(false);

  const saveDialog = async () => {
    const text = createNote(feature, tags, cancelled, location, note);
    if (text == null) {
      // eslint-disable-next-line no-alert
      alert('Proveďte, prosím, požadované změny.');
      return;
    }

    setLoading(true);
    setInsertedNote({
      text,
      url: await insertOsmNote(feature.center, text),
    });
  };

  const ico = icons.includes(feature.properties.class)
    ? feature.properties.class
    : 'information';

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-dialog-title"
    >
      <DialogTitle id="edit-dialog-title">
        <img
          src={`/icons/${ico}_11.svg`}
          alt={ico}
          title={ico}
          width={16}
          height={16}
        />{' '}
        Navrhnout úpravu: {feature.tags.name || feature.properties.subclass}
      </DialogTitle>
      {insertedNote ? (
        <SuccessContent insertedNote={insertedNote} handleClose={handleClose} />
      ) : (
        <>
          <DialogContent dividers>
            <MajorKeysEditor tags={tags} setTag={setTag} focusTag={focusTag} />

            <DialogHeading>Další možnosti</DialogHeading>
            <PlaceCancelledToggle
              cancelled={cancelled}
              toggle={toggleCancelled}
            />
            <ChangeLocationEditor
              location={location}
              setLocation={setLocation}
            />
            <ContributionInfoBox />
            <NoteField note={note} setNote={setNote} />

            <OtherTagsEditor tags={tags} setTag={setTag} focusTag={focusTag} />
          </DialogContent>
          <DialogActions>
            {loading && <CircularProgress />}
            <Button onClick={handleClose} color="primary">
              Zrušit
            </Button>
            <Button onClick={saveDialog} color="primary" variant="contained">
              Uložit
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
