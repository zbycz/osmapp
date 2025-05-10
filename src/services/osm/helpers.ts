import { OsmElement } from './types';
import { Feature } from '../types';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';

export type ItemsMap = {
  node: Record<number, OsmElement<'node'>>;
  way: Record<number, OsmElement<'way'>>;
  relation: Record<number, OsmElement<'relation'>>;
};

export const getItemsMap = (elements: OsmElement[]) => {
  const itemsMap: ItemsMap = { node: {}, way: {}, relation: {} };
  elements.forEach((element) => {
    itemsMap[element.type][element.id] = element;
  });
  return itemsMap;
};

export const getMemberFeatures = (
  members: Feature['members'],
  itemsMap: ReturnType<typeof getItemsMap>,
) =>
  (members ?? [])
    .map(({ type, ref, role }) => {
      const element = itemsMap[type][ref];
      if (!element) {
        return null;
      }

      const feature = addSchemaToFeature(osmToFeature(element));
      feature.osmMeta.role = role;

      // TODO this code is not used, but it had some meaning, leaving for now :)
      // feature.center = element.center
      //   ? [element.center.lon, element.center.lat] // from overpass "out center"
      //   : feature.center;

      return feature;
    })
    .filter(Boolean);
