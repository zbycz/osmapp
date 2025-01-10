import { OsmElement } from './types';
import { Feature } from '../types';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';

export const getItemsMap = (elements: OsmElement[]) => {
  const itemsMap = {
    node: {} as Record<number, OsmElement<'node'>>,
    way: {} as Record<number, OsmElement<'way'>>,
    relation: {} as Record<number, OsmElement<'relation'>>,
  };
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
