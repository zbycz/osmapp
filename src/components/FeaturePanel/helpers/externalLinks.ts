import { getLabel } from '../../../helpers/featureLabel';
import { Feature, LonLatBoth } from '../../../services/types';
import { View } from '../../utils/MapStateContext';
import { OSM_WEBSITE } from '../../../services/osm/consts';

export const getIdEditorLink = (feature: Feature, view?: View) => {
  const query = feature?.osmMeta?.id
    ? `?${feature.osmMeta.type}=${feature.osmMeta.id}`
    : '';
  const hash = view ? `#map=${view.join('/')}` : '';
  return `${OSM_WEBSITE}/edit${query}${hash}`;
};

export const getAppleMapsLink = (
  feature: Feature,
  position: LonLatBoth,
  isSateliteActive: boolean,
) => {
  const layer = isSateliteActive
    ? 'h' // satelite
    : 'm'; // normal

  const markerLabel = getLabel(feature);
  return `https://maps.apple.com/?ll=${position[1]},${position[0]}&t=${layer}&q=${markerLabel}`;
};
