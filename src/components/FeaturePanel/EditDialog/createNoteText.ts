import { EditDataItem } from './context/useEditItems';
import { getApiId, getUrlOsmId } from '../../../services/helpers';

export const createNoteText = (
  change: EditDataItem,
  location: string,
  note: string,
  isUndelete: boolean,
) => {
  const { tags, toBeDeleted, originalState: orig } = change;

  const isAdded = ([k, v]) => v && !orig.tags[k];
  const isRemoved = ([k, v]) => v && !tags[k];
  const addedTags = Object.entries(tags).filter(isAdded);
  const removedTags = Object.entries(orig.tags).filter(isRemoved);
  const changedTags = Object.entries(tags).filter(
    ([k, v]) => !isAdded([k, v]) && v && v !== orig.tags[k],
  );
  const changeOrAddedTags = [...addedTags, ...changedTags];

  const noteText = [];
  if (change.shortId.includes('-')) {
    noteText.push(`New ${getApiId(change.shortId).type} created`);
  } else {
    noteText.push(`Edited ${getUrlOsmId(getApiId(change.shortId))}`);
  }

  const preset = change.presetLabel;
  if (preset) {
    noteText.push(
      change.tags.name ? `${change.tags.name} (${preset}):` : preset,
    );
    noteText.push('');
  }
  if (isUndelete) {
    noteText.push('! Suggested undelete');
  }
  if (toBeDeleted) {
    noteText.push('! Place was marked permanently closed.');
  }
  if (location || change.nodeLonLat) {
    noteText.push('Suggested location change:');
    noteText.push(location || change.nodeLonLat.toReversed().join(', '));
    noteText.push('');
  }
  if (changeOrAddedTags.length) {
    noteText.push('Suggested changes:');
    noteText.push(changeOrAddedTags.map(([k, v]) => `${k}=${v}`).join('\n'));
    noteText.push('');
  }
  if (removedTags.length) {
    noteText.push(`Removed tags:`);
    noteText.push(removedTags.map(([k]) => k).join(', '));
    noteText.push('');
  }

  return noteText.join('\n');
};
