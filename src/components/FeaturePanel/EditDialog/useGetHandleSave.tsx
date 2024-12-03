import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { useEditDialogFeature } from './utils';
import { useEditContext } from './EditContext';
import { createNoteText } from './createNoteText';
import { t } from '../../../services/intl';
import { saveChanges } from '../../../services/osmApiAuth';
import { insertOsmNote } from '../../../services/osmApi';
import { useSnackbar } from '../../utils/SnackbarContext';
import { getShortId } from '../../../services/helpers';

const useGetSaveNote = () => {
  const { showToast } = useSnackbar();
  const { feature, isUndelete, isAddPlace } = useEditDialogFeature();
  const { setSuccessInfo, setIsSaving, location, comment, items } =
    useEditContext();

  return async () => {
    if (items.length !== 1) {
      showToast('Please log in to save multiple items.', 'error');
      return;
    }

    const { tags, toBeDeleted } = items.find(
      (item) => item.shortId === getShortId(feature.osmMeta),
    );

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

    return await insertOsmNote(feature.center, noteText);
  };
};

export const useGetHandleSave = () => {
  const { showToast } = useSnackbar();
  const { loggedIn, handleLogout } = useOsmAuthContext();
  const { feature } = useEditDialogFeature();
  const { setSuccessInfo, setIsSaving, comment, items } = useEditContext();
  const saveNote = useGetSaveNote();

  return async () => {
    try {
      setIsSaving(true);

      // TODO do not save when no changes

      const successInfo = loggedIn
        ? await saveChanges(feature, comment, items)
        : await saveNote();

      setSuccessInfo(successInfo);
      setTimeout(() => setIsSaving(false), 500);
    } catch (err) {
      setIsSaving(false);
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
    }
  };
};
