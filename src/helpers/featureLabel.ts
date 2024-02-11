import { Feature } from '../services/types';
import { roundedToDeg } from '../utils';
import { t } from '../services/intl';

export const getSubclass = ({ layer, osmMeta, properties, schema }: Feature) =>
  schema?.label ||
  properties.subclass?.replace(/_/g, ' ') ||
  (layer && layer.id) || // layer.id specified only when maplibre-gl skeleton displayed
  osmMeta.type;

const getRefLabel = (feature: Feature) =>
  feature.tags.ref ? `${getSubclass(feature)} ${feature.tags.ref}` : '';

const getName = ({ tags }: Feature) => tags.name; // TODO choose a name according to locale

export const hasName = (feature: Feature) => feature.point || getName(feature); // we dont want to show "No name" for point

export const getPoiType = (feature: Feature) =>
  hasName(feature) ? getSubclass(feature) : t('featurepanel.no_name');

export const getLabel = (feature: Feature) => {
  const { point, roundedCenter } = feature;
  if (point) {
    return roundedToDeg(roundedCenter);
  }

  return getName(feature) || getRefLabel(feature) || getSubclass(feature);
};
