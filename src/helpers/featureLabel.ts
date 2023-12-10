import { Feature } from '../services/types';
import { roundedToDeg } from '../utils';

const getSubclass = ({ properties, osmMeta, schema }: Feature) =>
  schema?.label || properties.subclass?.replace(/_/g, ' ') || osmMeta.type;

const getRef = (feature: Feature) =>
  feature.tags.ref ? `${getSubclass(feature)} ${feature.tags.ref}` : '';

const getName = ({ tags }: Feature) => tags.name; // TODO choose a name according to locale

export const hasName = (feature: Feature) => feature.point || getName(feature); // we dont want to show "No name" for point

export const getLabel = (feature: Feature) => {
  const { point, roundedCenter } = feature;
  if (point) {
    return roundedToDeg(roundedCenter);
  }

  return getName(feature) || getRef(feature) || getSubclass(feature);
};
