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
import { useRouter } from 'next/router';
import { useToggleState } from '../../helpers';
import { Feature, FeatureTags } from '../../../services/types';
import { createNoteText } from './createNoteText';
import { insertOsmNote } from '../../../services/osmApi';
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
import { addOsmFeature, editOsmFeature } from '../../../services/osmApiAuth';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { t } from '../../../services/intl';
import Maki from '../../utils/Maki';
import { getNameOrFallback } from '../../../utils';
import { FeatureTypeSelect } from './FeatureTypeSelect';

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

const useGetDialogTitle = (isAddPlace, isUndelete, feature) => {
  const { loggedIn } = useOsmAuthContext();
  if (isAddPlace) return t('editdialog.add_heading');
  if (isUndelete) return t('editdialog.undelete_heading');
  if (!loggedIn)
    return `${t('editdialog.suggest_heading')} ${getNameOrFallback(feature)}`;
  return `${t('editdialog.edit_heading')} ${getNameOrFallback(feature)}`;
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
  isAddPlace: boolean;
  isUndelete: boolean;
}

const saveDialog = ({
  feature,
  typeTag,
  tags,
  cancelled,
  location,
  comment,
  loggedIn,
  setLoading,
  setSuccessInfo,
  isUndelete,
}) => {
  const allTags = typeTag ? { [typeTag.key]: typeTag.value, ...tags } : tags;
  const noteText = createNoteText(
    feature,
    allTags,
    cancelled,
    location,
    comment,
    isUndelete,
  );
  if (noteText == null) {
    // TODO we need better check that this ... formik?
    alert(t('editdialog.changes_needed')); // eslint-disable-line no-alert
    return;
  }

  setLoading(true);
  const promise = loggedIn
    ? feature.point
      ? addOsmFeature(feature, comment, allTags)
      : editOsmFeature(feature, comment, allTags, cancelled)
    : insertOsmNote(feature.center, noteText);

  promise.then(setSuccessInfo, (err) => {
    console.error(err); // eslint-disable-line no-console
    setTimeout(() => setLoading(false), 1000);
  });
};

export const EditDialog = ({
  feature,
  open,
  handleClose,
  focusTag,
  isAddPlace,
  isUndelete,
}: Props) => {
  const router = useRouter();
  const { loggedIn } = useOsmAuthContext();
  const fullScreen = useIsFullScreen();
  const [typeTag, setTypeTag] = useState('');
  const [tags, setTag] = useTagsState(feature.tags); // TODO all these should go into `values`, consider Formik
  const [cancelled, toggleCancelled] = useToggleState(false);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<any>(false);

  const onClose = () => {
    handleClose();
    if (successInfo.redirect) {
      router.replace(successInfo.redirect); // only useRouter reloads the panel client-side
    }
  };

  const handleSave = () =>
    saveDialog({
      feature,
      typeTag,
      tags,
      cancelled,
      location,
      comment,
      loggedIn,
      setLoading,
      setSuccessInfo,
      isUndelete,
    });

  const dialogTitle = useGetDialogTitle(isAddPlace, isUndelete, feature);

  return (
    <StyledDialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="edit-dialog-title"
    >
      <DialogTitle id="edit-dialog-title">
        <Maki ico={feature.properties.class} size={16} /> {dialogTitle}
      </DialogTitle>
      {successInfo ? (
        <SuccessContent successInfo={successInfo} handleClose={onClose} />
      ) : (
        <>
          <DialogContent dividers>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              {isAddPlace && (
                <FeatureTypeSelect type={typeTag} setType={setTypeTag} />
              )}
              <MajorKeysEditor
                tags={tags}
                setTag={setTag}
                focusTag={focusTag}
              />

              {!isAddPlace && !isUndelete && (
                <>
                  <DialogHeading>
                    {t('editdialog.options_heading')}
                  </DialogHeading>
                  <PlaceCancelledToggle
                    cancelled={cancelled}
                    toggle={toggleCancelled}
                  />
                  <ChangeLocationEditor
                    location={location}
                    setLocation={setLocation}
                    feature={feature}
                  />
                </>
              )}
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
