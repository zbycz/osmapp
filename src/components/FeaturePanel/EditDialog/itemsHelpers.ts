import { FeatureTags, LonLat, OsmId } from '../../../services/types';
import { DataItem } from './useEditItems';
import {
  fetchSchemaTranslations,
  getPresetTranslation,
} from '../../../services/tagging/translations';
import { fetchJson } from '../../../services/fetch';
import { OsmResponse } from '../../../services/osm/types';
import { getOsmUrlOrFull } from '../../../services/osm/urls';
import { getItemsMap } from '../../../services/osm/helpers';
import { getShortId } from '../../../services/helpers';
import { findPreset } from '../../../services/tagging/presets';
import { getNewId } from '../../../services/getCoordsFeature';

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

export const fetchFreshItem = async (apiId: OsmId): Promise<DataItem> => {
  await fetchSchemaTranslations();
  const full = await fetchJson<OsmResponse>(getOsmUrlOrFull(apiId));
  const itemsMap = getItemsMap(full.elements);
  const main = itemsMap[apiId.type][apiId.id];

  return {
    shortId: getShortId(apiId),
    version: main.version,
    tagsEntries: Object.entries(main.tags),
    toBeDeleted: false,
    nodeLonLat: apiId.type === 'node' ? [main.lon, main.lat] : undefined,
    nodes: apiId.type === 'way' ? main.nodes : undefined,
    members: main.members?.map((member) => {
      const memberEl = itemsMap[member.type][member.ref];
      const label = memberEl
        ? (() => {
            if (memberEl.tags.name) {
              return memberEl.tags.name;
            }
            const preset = findPreset(member.type, memberEl.tags);
            return getPresetTranslation(preset.presetKey);
          })()
        : `${member.type} ${member.ref}`;

      return {
        shortId: getShortId({ type: member.type, id: member.ref }),
        role: member.role,
        label,
      };
    }),
  };
};
