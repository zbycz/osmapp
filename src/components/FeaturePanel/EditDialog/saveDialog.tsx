import { createNoteText } from './createNoteText';
import { t } from '../../../services/intl';
import { addOsmFeature, editOsmFeature } from '../../../services/osmApiAuth';
import { insertOsmNote } from '../../../services/osmApi';

export const saveDialog = ({
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
    console.error(err); // eslint-disable-line no-console
    setTimeout(() => setLoading(false), 1000);
  });
};
