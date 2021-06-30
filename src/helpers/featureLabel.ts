import { Feature } from '../services/types';
import { roundedToDeg } from '../utils';

const getSubclass = (properties) => properties.subclass?.replace(/_/g, ' '); // TODO translate ? maybe use iD editor logic (already with translations)

const getRef = ({ tags, properties }) =>
  tags.ref ? `${getSubclass(properties)} ${tags.ref}` : '';

const getName = (feature) => feature.tags.name || getRef(feature);

export const hasName = (feature) => feature.point || getName(feature);

export const getLabel = (feature: Feature) => {
  const { properties, osmMeta, point, roundedCenter } = feature;

  if (point) {
    return roundedToDeg(roundedCenter);
  }

  return getName(feature) || getSubclass(properties) || osmMeta.type;
};
