import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { useEditDialogFeature } from './utils';
import { useEditContext } from './EditContext';
import { createNoteText } from './createNoteText';
import { t } from '../../../services/intl';
import { addOsmFeature, editOsmFeature } from '../../../services/osmApiAuth';
import { insertOsmNote } from '../../../services/osmApi';
import { useSnackbar } from '../../utils/SnackbarContext';
import { getShortId } from '../../../services/helpers';

export const useGetHandleSave = () => {
  const { showToast } = useSnackbar();
  const { loggedIn, handleLogout } = useOsmAuthContext();
  const { feature, isUndelete, isAddPlace } = useEditDialogFeature();
  const { setSuccessInfo, setIsSaving, location, comment, items } =
    useEditContext();

  return () => {
    //TODO temporary
    const { tags, toBeDeleted } = items.find(
      (item) => item.shortId === getShortId(feature.osmMeta),
    );

    // TODO refactor this to check for errors in the form
    const noteText = createNoteText(
      feature,
      tags,
      toBeDeleted,
      location,
      comment,
      isUndelete,
    );
    if (noteText == null) {
      showToast(t('editdialog.changes_needed'), 'warning');
      return;
    }

    setIsSaving(true);
    const promise = loggedIn
      ? isAddPlace
        ? addOsmFeature(feature, comment, tags)
        : editOsmFeature(feature, comment, tags, toBeDeleted)
      : insertOsmNote(feature.center, noteText);

    promise.then(setSuccessInfo, (err) => {
      if (err?.status === 401) {
        showToast(t('editdialog.osm_session_expired'), 'error');
        handleLogout();
      } else {
        showToast(
          `${t('editdialog.save_refused')} ${err.responseText ?? err.message}`,
          'error',
        );
        console.error(err); // eslint-disable-line no-console
      }
      setTimeout(() => setIsSaving(false), 500);
    });
  };
};
