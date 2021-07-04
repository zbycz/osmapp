import { Feature, FeatureTags } from '../../../services/types';
import { getFullOsmappLink } from '../../../services/helpers';
import { getLabel, hasName } from '../../../helpers/featureLabel';

export const createNoteText = (
  feature: Feature,
  newTags: FeatureTags,
  placeCancelled: boolean,
  location: string,
  note: string,
  isUndelete: boolean,
) => {
  const isAdded = ([k, v]) => v && !feature.tags[k];
  const isRemoved = ([k, v]) => v && !newTags[k];
  const addedTags = Object.entries(newTags).filter(isAdded);
  const removedTags = Object.entries(feature.tags).filter(isRemoved);
  const changedTags = Object.entries(newTags).filter(
    ([k, v]) => !isAdded([k, v]) && v && v !== feature.tags[k],
  );
  const changeOrAddedTags = [...addedTags, ...changedTags];

  if (
    !changeOrAddedTags.length &&
    !removedTags.length &&
    !placeCancelled &&
    !location &&
    !note &&
    !isUndelete
  ) {
    return null;
  }

  const noteText = [];
  if (!feature.point) {
    const {subclass} = feature.properties;
    noteText.push(
      hasName(feature) ? `${getLabel(feature)} (${subclass}):` : subclass,
    );
    noteText.push('');
  }
  if (isUndelete) {
    noteText.push('! Suggested undelete');
  }
  if (placeCancelled) {
    noteText.push('! Place was marked permanently closed.');
  }
  if (note) {
    noteText.push(note);
    noteText.push('');
  }
  if (location) {
    noteText.push('Suggested location change:');
    noteText.push(location);
    noteText.push('');
  }
  if (changeOrAddedTags.length) {
    noteText.push(feature.point ? 'Suggested tags:' : 'Suggested changes:');
    noteText.push(changeOrAddedTags.map(([k, v]) => `${k}=${v}`).join('\n'));
    noteText.push('');
  }
  if (removedTags.length) {
    noteText.push(`Removed tags:`);
    noteText.push(removedTags.map(([k]) => k).join(', '));
    noteText.push('');
  }
  noteText.push('');
  noteText.push(`Submitted from ${getFullOsmappLink(feature)}`);
  return noteText.join('\n');
};
