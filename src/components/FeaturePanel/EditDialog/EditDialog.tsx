import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import DialogContent from '@material-ui/core/DialogContent';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import Router from 'next/router';
import { useToggleState } from '../../helpers';
import { Feature, FeatureTags } from '../../../services/types';
import { createNoteText } from './createNoteText';
import { clearFeatureCache, insertOsmNote } from '../../../services/osmApi';
import { MajorKeysEditor } from './MajorKeysEditor';
import {
  ChangeLocationEditor,
  CommentField,
  ContributionInfoBox,
  DialogHeading,
  OsmLogin,
  PlaceCancelledToggle,
} from './components';
import { OtherTagsEditor } from './OtherTagsEditor';
import { SuccessContent } from './SuccessContent';
import { icons } from '../../../assets/icons';
import { editOsmFeature } from '../../../services/osmApiAuth';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { t } from '../../../services/intl';

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

const saveDialog = ({
  feature,
  tags,
  cancelled,
  location,
  comment,
  loggedIn,
  setLoading,
  setSuccessInfo,
}) => {
  const noteText = createNoteText(
    feature,
    tags,
    cancelled,
    location,
    comment,
    loggedIn,
  );
  if (noteText == null) {
    alert(t('editdialog.changes_needed')); // eslint-disable-line no-alert
    return;
  }

  setLoading(true);
  const promise = loggedIn
    ? editOsmFeature(feature, comment, tags, cancelled)
    : insertOsmNote(feature.center, noteText);

  promise.then(setSuccessInfo, () => setTimeout(() => setLoading(false), 1000));
};

export const EditDialog = ({ feature, open, handleClose, focusTag }: Props) => {
  const fullScreen = useIsFullScreen();
  const [tags, setTag] = useTagsState(feature.tags); // TODO all these should go into `values`, consider Formik
  const [cancelled, toggleCancelled] = useToggleState(false);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
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

  const handleSave = () =>
    saveDialog({
      feature,
      tags,
      cancelled,
      location,
      comment,
      loggedIn,
      setLoading,
      setSuccessInfo,
    });

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

              <ContributionInfoBox />
              <CommentField comment={comment} setComment={setComment} />

              <OtherTagsEditor
                tags={tags}
                setTag={setTag}
                focusTag={focusTag}
              />

              <OsmLogin />
            </form>
          </DialogContent>
          <DialogActions>
            {loading && <CircularProgress size={20} />}
            <Button onClick={onClose} color="primary">
              {t('editdialog.cancel_button')}
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              {loggedIn
                ? cancelled
                  ? t('editdialog.save_button_delete')
                  : t('editdialog.save_button_edit')
                : t('editdialog.save_button_note')}
            </Button>
          </DialogActions>
        </>
      )}
    </StyledDialog>
  );
};
