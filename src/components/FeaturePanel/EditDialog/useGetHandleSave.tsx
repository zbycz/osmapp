import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { useEditDialogFeature } from './utils';
import { useEditContext } from './EditContext';
import { createNoteText } from './createNoteText';
import { t } from '../../../services/intl';
import { saveChanges } from '../../../services/osm/auth/osmApiAuth';
import { insertOsmNote } from '../../../services/osm/insertOsmNote';
import { useSnackbar } from '../../utils/SnackbarContext';
import { getShortId } from '../../../services/helpers';
import { useEditDialogContext } from '../helpers/EditDialogContext';

const useGetSaveNote = () => {
  const { showToast } = useSnackbar();
  const { feature, isUndelete } = useEditDialogFeature();
  const { location, comment, items } = useEditContext();

  return async () => {
    const texts = items.map((item) => {
      const { tags, toBeDeleted } = item;
      const noteText = createNoteText(
        feature, // TODO this is wrong, we must diff each feature from its original state, not from the feature it was opened from
        tags,
        toBeDeleted,
        location,
        comment,
        isUndelete,
      );
      return noteText;
    });

    const noteText = texts.join('\n\n--------\n');
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
  const { setRedirectOnClose } = useEditDialogContext();
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
      setRedirectOnClose(successInfo.redirect);
      setTimeout(() => setIsSaving(false), 500);
    } catch (err) {
      setIsSaving(false);
      if (err?.status === 401) {
        showToast(t('editdialog.osm_session_expired'), 'error');
        handleLogout();
      } else {
        showToast(
          `${t('editdialog.save_refused')} ${err.responseText ?? err.message ?? err}`,
          'error',
        );
        console.error(err); // eslint-disable-line no-console
      }
    }
  };
};
