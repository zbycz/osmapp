import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import DialogContent from '@material-ui/core/DialogContent';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
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
import {
  editOsmFeature,
  fetchOsmUsername,
  getOsmUsername,
  osmLogout,
} from '../../../services/osmApiAuth';

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

const StyledDialog = styled(Dialog)`
  .MuiDialog-container.MuiDialog-scrollPaper {
    align-items: start;
  }
`;

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
  const [successInfo, setSuccessInfo] = useState<any>({
    text: 'asdf',
    changesetUrl: '123',
  });
  const [osmUser, setOsmUser] = useState(getOsmUsername());
  const onLogin = () => fetchOsmUsername().then(setOsmUser);
  const onLogout = () => osmLogout().then(() => setOsmUser(false));

  const saveDialog = async () => {
    const text = createNote(feature, tags, cancelled, location, note);
    if (text == null) {
      // eslint-disable-next-line no-alert
      alert('Proveďte, prosím, požadované změny.');
      return;
    }

    setLoading(true);
    setSuccessInfo(
      osmUser
        ? await editOsmFeature(feature, text, tags, cancelled, location)
        : await insertOsmNote(feature.center, text),
    );
  };

  const ico = icons.includes(feature.properties.class)
    ? feature.properties.class
    : 'information';

  return (
    <StyledDialog
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
        {osmUser ? 'Upravit: ' : 'Navrhnout úpravu: '}
        {feature.tags.name || feature.properties.subclass}
      </DialogTitle>
      {successInfo ? (
        <SuccessContent successInfo={successInfo} handleClose={handleClose} />
      ) : (
        <>
          <DialogContent dividers>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <MajorKeysEditor
                tags={tags}
                setTag={setTag}
                focusTag={focusTag}
              />

              <DialogHeading>Možnosti</DialogHeading>
              <PlaceCancelledToggle
                cancelled={cancelled}
                toggle={toggleCancelled}
              />
              <ChangeLocationEditor
                location={location}
                setLocation={setLocation}
              />

              <ContributionInfoBox loggedIn={!!osmUser} />
              <NoteField note={note} setNote={setNote} />

              <OtherTagsEditor
                tags={tags}
                setTag={setTag}
                focusTag={focusTag}
              />

              <Typography variant="body2" color="textSecondary" paragraph>
                {osmUser ? (
                  <>
                    Jste přihlášeni jako <b>{osmUser}</b>, změny se ihned
                    projeví v mapě. (
                    <button
                      type="button"
                      className="linkLikeButton"
                      onClick={onLogout}
                    >
                      odhlásit
                    </button>
                    )
                  </>
                ) : (
                  <>
                    Vkládáte <b>anonymní</b> poznámku do mapy.
                    <br />
                    Pokud se{' '}
                    <button
                      type="button"
                      className="linkLikeButton"
                      onClick={onLogin}
                    >
                      přihlásíte do OpenStreetMap
                    </button>
                    , změny se ihned projeví v mapě.
                  </>
                )}
              </Typography>
            </form>
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
    </StyledDialog>
  );
};
