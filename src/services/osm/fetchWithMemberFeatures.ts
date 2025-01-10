import { Feature, OsmId } from '../types';
import { fetchJson } from '../fetch';
import { getOsmFullUrl, getOsmUrl } from './urls';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';
import { getItemsMap, getMemberFeatures } from './helpers';
import { mergeMemberImageDefs } from '../images/getImageDefs';

export const fetchWithMemberFeatures = async (apiId: OsmId) => {
  if (apiId.type !== 'relation') {
    const wayOrNodeResponse = await fetchJson(getOsmUrl(apiId));
    const wayOrNode = wayOrNodeResponse.elements[0];
    return addSchemaToFeature(osmToFeature(wayOrNode));
  }

  const full = await fetchJson(getOsmFullUrl(apiId));
  const map = getItemsMap(full.elements);
  const relation = map.relation[apiId.id];

  const out: Feature = {
    ...addSchemaToFeature(osmToFeature(relation)),
    memberFeatures: getMemberFeatures(relation.members, map),
  };
  mergeMemberImageDefs(out);
  return out;
};
