import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useRouter } from 'next/router';
import { useToggleState } from '../../helpers';
import { Feature } from '../../../services/types';
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
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { t } from '../../../services/intl';
import Maki from '../../utils/Maki';
import { FeatureTypeSelect } from './FeatureTypeSelect';
import { ActionButtons } from './ActionButtons';
import {
  ResponsiveDialogContent,
  StyledDialog,
  useGetDialogTitle,
  useIsFullScreen,
  useTagsState,
} from './utils';
import { saveDialog } from './saveDialog';

interface Props {
  feature: Feature;
  open: boolean;
  handleClose: () => void;
  focusTag: boolean | string;
  isAddPlace: boolean;
  isUndelete: boolean;
}

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
  const [tmpNewTag, setTmpNewTag] = useState({});
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
      tmpNewTag,
      cancelled,
      location,
      comment,
      loggedIn,
      setLoading,
      setSuccessInfo,
      isUndelete,
    });

  const dialogTitle = useGetDialogTitle(isAddPlace, isUndelete, feature);

  const actionButtons = (
    <ActionButtons
      loading={loading}
      onClose={onClose}
      handleSave={handleSave}
      cancelled={cancelled}
    />
  );

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
        <ResponsiveDialogContent actionButtons={actionButtons}>
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            {false && <FeatureTypeSelect type={typeTag} setType={setTypeTag} />}
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
        </ResponsiveDialogContent>
      )}
    </StyledDialog>
  );
};
