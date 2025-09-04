import {
  FeatureTags,
  LonLat,
  OsmId,
  RelationMember,
} from '../../../services/types';
import { DataItem, DataItemRaw, Members } from './useEditItems';
import {
  fetchSchemaTranslations,
  getPresetTranslation,
} from '../../../services/tagging/translations';
import { fetchJson } from '../../../services/fetch';
import { OsmElement, OsmResponse } from '../../../services/osm/types';
import { getOsmUrlOrFull } from '../../../services/osm/urls';
import { getItemsMap, ItemsMap } from '../../../services/osm/helpers';
import { getShortId } from '../../../services/helpers';
import { findPreset } from '../../../services/tagging/presets';
import { getNewId } from '../../../services/getCoordsFeature';
import { getLastBeforeDeleted } from '../../../services/osm/osmApi';

export const addEmptyOriginalState = (dataItem: DataItemRaw): DataItem => ({
  ...dataItem,
  originalState: {
    tags: {},
    isDeleted: false,
    nodeLonLat: undefined,
    nodes: undefined,
    members: undefined,
  },
});

export const getNewNodeItem = (
  [lon, lat]: LonLat,
  tags: FeatureTags = {},
): DataItem =>
  addEmptyOriginalState({
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
    const url = getOsmUrlOrFull(apiId);
    return await fetchJson<OsmResponse>(url, { nocache: true }); // nocache - used for fetchFreshItem()
  } catch (e) {
    const undeleted = await getLastBeforeDeleted(e, apiId);
    if (undeleted) {
      return { elements: [undeleted] };
    }
    throw e;
  }
};

const getMembers = (el: OsmElement, itemsMap: ItemsMap): Members =>
  el.members?.map((member) => ({
    shortId: getShortId({ type: member.type, id: member.ref }),
    role: member.role,
    label: getLabel(itemsMap, member),
  })) ?? [];

// For FeaturePanel use getFullFeatureWithMemberFeatures() which returns `Feature` type
export const fetchFreshItem = async (apiId: OsmId): Promise<DataItem> => {
  await fetchSchemaTranslations();
  const full = await getFullOrDeleted(apiId);
  const itemsMap = getItemsMap(full.elements);
  const el = itemsMap[apiId.type][apiId.id];

  const tags = el.tags ?? {};
  const nodeLonLat = el.type === 'node' ? [el.lon, el.lat] : undefined;
  const nodes = el.type === 'way' ? el.nodes : undefined;
  const members = el.type === 'relation' ? getMembers(el, itemsMap) : undefined;

  return {
    shortId: getShortId(el),
    version: el.version,
    tagsEntries: Object.entries(tags),
    toBeDeleted: false,
    nodeLonLat,
    nodes,
    members,
    originalState: {
      tags: JSON.parse(JSON.stringify(tags)),
      isDeleted: !!el.osmappDeletedMarker, // for undelete the initial value is changed to false
      nodeLonLat,
      nodes,
      members,
    },
  };
};
