import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
import { FeatureTypeSelect } from './FeatureTypeSelect';
import { getLabel } from '../../../helpers/featureLabel';
import { useUserThemeContext } from '../../../helpers/theme';
import { useEditDialogContext } from '../helpers/EditDialogContext';

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
    return `${t('editdialog.suggest_heading')} ${getLabel(feature)}`;
  return `${t('editdialog.edit_heading')} ${getLabel(feature)}`;
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-container.MuiDialog-scrollPaper {
    align-items: start;
  }
`;

interface Props {
  feature: Feature;
  isAddPlace: boolean;
  isUndelete: boolean;
}

const saveDialog = ({
  feature,
  typeTag,
  tags,
  tmpNewTag,
  cancelled,
  location,
  comment,
  loggedIn,
  setLoading,
  setSuccessInfo,
  isUndelete,
  handleLogout,
}) => {
  const tagsWithType = typeTag
    ? { [typeTag.key]: typeTag.value, ...tags }
    : tags;
  const allTags = { ...tagsWithType, ...tmpNewTag }; // we need to send also unsubmitted new tag
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
    if (err?.status === 401) {
      alert(t('editdialog.osm_session_expired')); // eslint-disable-line no-alert
      handleLogout();
    } else {
      console.error(err); // eslint-disable-line no-console
    }
    setTimeout(() => setLoading(false), 500);
  });
};

export const EditDialog = ({ feature, isAddPlace, isUndelete }: Props) => {
  const { currentTheme } = useUserThemeContext();
  const router = useRouter();
  const { loggedIn, handleLogout } = useOsmAuthContext();
  const { opened, close, focusTag } = useEditDialogContext();

  const fullScreen = useIsFullScreen();
  const [typeTag, setTypeTag] = useState('');
  const [tags, setTag] = useTagsState(feature.tags); // TODO all these should go into `values`, consider Formik
  const [tmpNewTag, setTmpNewTag] = useState({});
  const [cancelled, toggleCancelled] = useToggleState(false);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<any>(false);

  const onClose = () => {
    close();
    if (successInfo.redirect) {
      router.replace(successInfo.redirect); // only useRouter reloads the panel client-side
    }
  };

  const handleSave = () =>
    saveDialog({
      feature,
      typeTag,
      tags,
      tmpNewTag,
      cancelled,
      location,
      comment,
      loggedIn,
      setLoading,
      setSuccessInfo,
      isUndelete,
      handleLogout,
    });

  const dialogTitle = useGetDialogTitle(isAddPlace, isUndelete, feature);

  return (
    <StyledDialog
      fullScreen={fullScreen}
      open={opened}
      onClose={onClose}
      aria-labelledby="edit-dialog-title"
    >
      <DialogTitle id="edit-dialog-title">
        <Maki
          ico={feature.properties.class}
          size={16}
          invert={currentTheme === 'dark'}
        />{' '}
        {dialogTitle}
      </DialogTitle>
      {successInfo ? (
        <SuccessContent successInfo={successInfo} handleClose={onClose} />
      ) : (
        <>
          <DialogContent dividers>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              {false && (
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
                setTmpNewTag={setTmpNewTag}
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
