import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { useEditDialogFeature } from './utils';
import { useEditContext } from './EditContext';
import { createNoteText } from './createNoteText';
import { t } from '../../../services/intl';
import { addOsmFeature, editOsmFeature } from '../../../services/osmApiAuth';
import { insertOsmNote } from '../../../services/osmApi';

export const useGetHandleSave = () => {
  const { loggedIn, handleLogout } = useOsmAuthContext();
  const { feature, isUndelete } = useEditDialogFeature();
  const {
    setSuccessInfo,
    setIsSaving,
    location,
    comment,
    tags: { tags, typeTag, tmpNewTag, cancelled },
  } = useEditContext();

  return () => {
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

    setIsSaving(true);
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
      setTimeout(() => setIsSaving(false), 500);
    });
  };
};
