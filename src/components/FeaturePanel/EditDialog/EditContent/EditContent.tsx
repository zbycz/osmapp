import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
} from '@mui/material';
import React from 'react';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { useEditDialogFeature } from '../utils';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import { useEditContext } from '../EditContext';
import { useGetOnClose } from '../useGetOnClose';
import { useGetHandleSave } from '../useGetHandleSave';
import { FeatureTypeSelect } from '../FeatureTypeSelect';
import { MajorKeysEditor } from '../MajorKeysEditor';
import {
  ChangeLocationEditor,
  CommentField,
  ContributionInfoBox,
  DialogHeading,
  OsmLogin,
  PlaceCancelledToggle,
} from '../components';
import { t } from '../../../../services/intl';
import { OtherTagsEditor } from '../OtherTagsEditor';

export const EditContent = () => {
  const { loggedIn } = useOsmAuthContext();
  const { feature, isAddPlace, isUndelete } = useEditDialogFeature();
  const { focusTag } = useEditDialogContext();
  const {
    isSaving,
    location,
    setLocation,
    comment,
    setComment,
    tags: {
      tags,
      setTag,
      typeTag,
      setTypeTag,
      setTmpNewTag,
      cancelled,
      toggleCancelled,
    },
  } = useEditContext();

  const onClose = useGetOnClose();
  const handleSave = useGetHandleSave();

  return (
    <>
      <DialogContent dividers>
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <FeatureTypeSelect type={typeTag} setType={setTypeTag} />
          <MajorKeysEditor tags={tags} setTag={setTag} focusTag={focusTag} />

          {!isAddPlace && !isUndelete && (
            <>
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
        {isSaving && <CircularProgress size={20} />}
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
  );
};
