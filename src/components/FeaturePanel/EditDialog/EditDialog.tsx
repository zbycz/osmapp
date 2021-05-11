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
import Router from 'next/router';
import { useToggleState } from '../../helpers';
import { Feature, FeatureTags } from '../../../services/types';
import { createNoteText } from './createNoteText';
import { clearFeatureCache, insertOsmNote } from '../../../services/osmApi';
import { MajorKeysEditor } from './MajorKeysEditor';
import {
  ChangeLocationEditor,
  ContributionInfoBox,
  CommentField,
  DialogHeading,
  PlaceCancelledToggle,
} from './components';
import { OtherTagsEditor } from './OtherTagsEditor';
import { SuccessContent } from './SuccessContent';
import { icons } from '../../../assets/icons';
import { editOsmFeature } from '../../../services/osmApiAuth';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { t, Translation } from '../../../services/intl';

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

const OsmLogin = () => {
  const { loggedIn, osmUser, handleLogin, handleLogout } = useOsmAuthContext();

  return (
    <Typography variant="body2" color="textSecondary" paragraph>
      {loggedIn ? (
        <>
          <Translation id="editdialog.loggedInMessage" values={{ osmUser }} /> (
          <button
            type="button"
            className="linkLikeButton"
            onClick={handleLogout}
          >
            {t('editdialog.logout')}
          </button>
          )
        </>
      ) : (
        <>
          <Translation id="editdialog.anonymousMessage1" />{' '}
          <button
            type="button"
            className="linkLikeButton"
            onClick={handleLogin}
          >
            {t('editdialog.anonymousMessage2_login')}
          </button>
          <Translation id="editdialog.anonymousMessage3" />
        </>
      )}
    </Typography>
  );
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
  const [comment, setComment] = useState('');
  const [tags, setTag] = useTagsState(feature.tags);
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<any>(false);
  const { loggedIn } = useOsmAuthContext();

  const onClose = () => {
    if (successInfo && loggedIn) {
      handleClose();
      clearFeatureCache(feature.osmMeta);
      Router.reload(); // TODO Router.replace(window.location.pathname) doesnt update the Panel
    } else {
      handleClose();
    }
  };

  const saveDialog = async () => {
    const noteText = createNoteText(
      feature,
      tags,
      cancelled,
      location,
      comment,
      loggedIn,
    );
    if (noteText == null) {
      // eslint-disable-next-line no-alert
      alert(t('editdialog.changes_needed'));
      return;
    }

    setLoading(true);
    setSuccessInfo(
      loggedIn
        ? await editOsmFeature(feature, comment, tags, cancelled)
        : await insertOsmNote(feature.center, noteText),
    );
  };

  const ico = icons.includes(feature.properties.class)
    ? feature.properties.class
    : 'information';

  return (
    <StyledDialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
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
        {loggedIn
          ? t('editdialog.edit_heading')
          : t('editdialog.suggest_heading')}{' '}
        {feature.tags.name || feature.properties.subclass}
      </DialogTitle>
      {successInfo ? (
        <SuccessContent successInfo={successInfo} handleClose={onClose} />
      ) : (
        <>
          <DialogContent dividers>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <MajorKeysEditor
                tags={tags}
                setTag={setTag}
                focusTag={focusTag}
              />

              <DialogHeading>{t('editdialog.options_heading')}</DialogHeading>
              <PlaceCancelledToggle
                cancelled={cancelled}
                toggle={toggleCancelled}
              />
              <ChangeLocationEditor
                location={location}
                setLocation={setLocation}
                feature={feature}
              />

              <ContributionInfoBox loggedIn={loggedIn} />
              <CommentField note={comment} setNote={setComment} />

              <OtherTagsEditor
                tags={tags}
                setTag={setTag}
                focusTag={focusTag}
              />

              <OsmLogin />
            </form>
          </DialogContent>
          <DialogActions>
            {loading && <CircularProgress />}
            <Button onClick={onClose} color="primary">
              {t('editdialog.cancel_button')}
            </Button>
            <Button onClick={saveDialog} color="primary" variant="contained">
              {t('editdialog.save_button')}
            </Button>
          </DialogActions>
        </>
      )}
    </StyledDialog>
  );
};
