import { usePersistedState } from '../../../../../utils/usePersistedState';

/**
 * Debug feature flag for the experimental iD-style FieldsEditor.
 *
 * It is a runtime flag stored in localStorage so it can be toggled in the app
 * (see "Develop: use iD-style fields editor" in User settings) without a rebuild.
 * You can also flip it from the devtools console:
 *   localStorage.setItem('experimental_fields_editor', 'true'); location.reload();
 */
export const FIELDS_EDITOR_FLAG = 'experimental_fields_editor';

// Shows a per-field debug caption (fieldKey · type · key) under each input.
export const FIELDS_EDITOR_DEBUG_FLAG = 'experimental_fields_editor_debug';

export const useFieldsEditorEnabled = () =>
  usePersistedState<boolean>(FIELDS_EDITOR_FLAG, false);

export const useFieldsEditorDebug = () => {
  const [debug] = usePersistedState<boolean>(FIELDS_EDITOR_DEBUG_FLAG, false);
  return debug;
};
