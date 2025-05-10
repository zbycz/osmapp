import { Feature, OsmId } from '../types';
import { fetchSchemaTranslations } from '../tagging/translations';
import { fetchJson } from '../fetch';
import { OsmResponse } from './types';
import { getOsmUrlOrFull } from './urls';
import { getItemsMap, getMemberFeatures } from './helpers';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';

// For EditDialog - use fetchFreshItem() which returns DataItem
export const getFullFeatureWithMemberFeatures = async (
  apiId: OsmId,
): Promise<Feature> => {
  await fetchSchemaTranslations();
  const full = await fetchJson<OsmResponse>(getOsmUrlOrFull(apiId));
  const itemsMap = getItemsMap(full.elements);
  const feature = addSchemaToFeature(
    osmToFeature(itemsMap[apiId.type][apiId.id]),
  );
  return {
    ...feature,
    memberFeatures: getMemberFeatures(feature.members, itemsMap),
  };
};
