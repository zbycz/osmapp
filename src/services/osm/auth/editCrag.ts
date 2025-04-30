import * as api from './api';
import { Feature, FeatureTags } from '../../types';
import { join } from '../../../utils';
import { getLabel } from '../../../helpers/featureLabel';
import { clearFetchCache } from '../../fetchCache';
import { OSM_WEBSITE } from '../consts';
import { getOsmappLink } from '../../helpers';
import { getChangesetXml, updateItemXml } from './osmApiAuth';

export type CragChange = {
  feature: Feature;
  allTags: FeatureTags;
  toBeDeleted?: boolean;
};

const saveCragChange = async (
  changesetId: any,
  { feature, allTags, toBeDeleted }: CragChange,
) => {
  const apiId = feature.osmMeta;
  const item = await api.getItem(apiId);

  // TODO use version from `feature` (we dont want to overwrite someones changes) or at least just apply tags diff (see createNoteText)
  const newItem = updateItemXml(item, apiId, changesetId, allTags, toBeDeleted);

  await api.putOrDeleteItem(toBeDeleted, apiId, newItem);
};

// TODO refactor to use saveChanges() or Diff

export const editCrag = async (
  crag: Feature,
  comment: string,
  changes: CragChange[],
) => {
  if (!changes.length) {
    return {
      type: 'error',
      text: 'No route has changed.',
    }; // TODO this is not SuccessInfo type
  }

  const changesetComment = join(
    comment,
    ' • ',
    `Edited ${getLabel(crag)} #osmapp #climbing`,
  );
  const changesetXml = getChangesetXml({ changesetComment, feature: crag });
  const changesetId = await api.putChangeset(changesetXml);

  await Promise.all(
    changes.map((change) => saveCragChange(changesetId, change)),
  );
  await api.putChangesetClose(changesetId);

  clearFetchCache();

  return {
    type: 'edit',
    text: changesetComment,
    url: `${OSM_WEBSITE}/changeset/${changesetId}`,
    redirect: `${getOsmappLink(crag)}`,
  };
};
