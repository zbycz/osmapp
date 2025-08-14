import {
  FeatureTags,
  LonLat,
  OsmId,
  RelationMember,
} from '../../../services/types';
import { DataItem } from './useEditItems';
import {
  fetchSchemaTranslations,
  getPresetTranslation,
} from '../../../services/tagging/translations';
import { fetchJson } from '../../../services/fetch';
import { OsmResponse } from '../../../services/osm/types';
import { getOsmUrlOrFull } from '../../../services/osm/urls';
import { getItemsMap, ItemsMap } from '../../../services/osm/helpers';
import { getShortId } from '../../../services/helpers';
import { findPreset } from '../../../services/tagging/presets';
import { getNewId } from '../../../services/getCoordsFeature';
import { getLastBeforeDeleted } from '../../../services/osm/osmApi';

export const getNewNodeItem = (
  [lon, lat]: LonLat,
  tags: FeatureTags = {},
): DataItem => ({
  shortId: `n${getNewId()}`,
  version: undefined,
  tagsEntries: Object.entries(tags),
  toBeDeleted: false,
  nodeLonLat: [lon, lat],
  nodes: undefined,
  members: undefined,
});

const getLabel = (itemsMap: ItemsMap, member: RelationMember) => {
  const element = itemsMap[member.type][member.ref];
  if (!element) {
    return `${member.type} ${member.ref}`;
  }

  if (element.tags?.name) {
    return element.tags.name;
  }

  const preset = findPreset(member.type, element.tags ?? {});
  return getPresetTranslation(preset.presetKey);
};

const getFullOrDeleted = async (apiId: OsmId): Promise<OsmResponse> => {
  try {
    return await fetchJson<OsmResponse>(getOsmUrlOrFull(apiId));
  } catch (e) {
    const undeleted = await getLastBeforeDeleted(e, apiId);
    if (undeleted) {
      return { elements: [undeleted] };
    }
    throw e;
  }
};

// For FeaturePanel - use getFullFeatureWithMemberFeatures() which returns `Feature` type
export const fetchFreshItem = async (apiId: OsmId): Promise<DataItem> => {
  await fetchSchemaTranslations();
  const full = await getFullOrDeleted(apiId);
  const itemsMap = getItemsMap(full.elements);
  const main = itemsMap[apiId.type][apiId.id];

  return {
    shortId: getShortId(apiId),
    version: main.version,
    tagsEntries: Object.entries(main.tags ?? {}),
    toBeDeleted: false,
    nodeLonLat: apiId.type === 'node' ? [main.lon, main.lat] : undefined,
    nodes: apiId.type === 'way' ? main.nodes : undefined,
    members:
      apiId.type === 'relation'
        ? (main.members?.map((member) => ({
            shortId: getShortId({ type: member.type, id: member.ref }),
            role: member.role,
            label: getLabel(itemsMap, member),
          })) ?? [])
        : undefined,
  };
};
