import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { useEditDialogFeature } from './utils';
import { useEditContext } from './context/EditContext';
import { createNoteText } from './createNoteText';
import { t } from '../../../services/intl';
import { saveChanges } from '../../../services/osm/auth/osmApiAuth';
import { insertOsmNote } from '../../../services/osm/insertOsmNote';
import { useSnackbar } from '../../utils/SnackbarContext';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { getFullOsmappLink } from '../../../services/helpers';

const useGetSaveNote = () => {
  const { showToast } = useSnackbar();
  const { feature, isUndelete } = useEditDialogFeature();
  const { location, comment, items } = useEditContext();

  return async () => {
    const texts = [];
    if (comment) {
      texts.push(`${comment}`);
    }
    texts.push(
      ...items
        .filter(({ modified }) => modified)
        .map((item) => createNoteText(item, location, comment, isUndelete)),
    );

    texts.push(`\nSubmitted from ${getFullOsmappLink(feature)}`);

    const noteText = texts.join('\n\n--------\n');
    if (!noteText.length) {
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
  const { setSuccessInfo, setIsSaving, comment, items, setValidate } =
    useEditContext();
  const saveNote = useGetSaveNote();

  return async () => {
    try {
      if (
        items
          .filter(({ shortId }) => shortId[0] === 'n')
          .some(({ nodeLonLat }) => nodeLonLat === undefined)
      ) {
        showToast(t('editdialog.set_location_for_all_items'), 'warning');
        setValidate(true);
        return;
      }

      setIsSaving(true);

      const changes = items.filter((item) => item.modified);

      const successInfo = loggedIn
        ? await saveChanges(feature, comment, changes)
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
