import { isIOS } from '../../../helpers/platforms';
import { t } from '../../../services/intl';
import { PositionBoth } from '../../../services/types';
import { isMobileDevice } from '../../helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useMapStateContext } from '../../utils/MapStateContext';
import { getAppleMapsLink, getIdEditorLink } from '../helpers/externalLinks';

// Our map uses 512 tiles, so our zoom is "one less"
// https://wiki.openstreetmap.org/wiki/Zoom_levels#Mapbox_GL
const MAPLIBREGL_ZOOM_DIFFERENCE = 1;

type ExternalMapLink = {
  label: string;
  href: string;
};

export const useGetItems = (position: PositionBoth): ExternalMapLink[] => {
  const { feature } = useFeatureContext();
  const { view, activeLayers } = useMapStateContext();
  const [ourZoom] = view;
  const [lon, lat] = position;

  const zoom = parseFloat(ourZoom) + MAPLIBREGL_ZOOM_DIFFERENCE;
  const zoomInt = Math.round(zoom);
  const osmQuery = feature?.osmMeta?.id
    ? `${feature.osmMeta.type}/${feature.osmMeta.id}`
    : `?mlat=${lat}&mlon=${lon}&zoom=${zoomInt}`;

  return [
    {
      label: 'OpenStreetMap.org',
      href: `https://openstreetmap.org/${osmQuery}`,
    },
    {
      label: 'OpenStreetMap.cz',
      href: `https://openstreetmap.cz/${osmQuery}`,
    },
    {
      label: 'Mapy.cz',
      href: `https://mapy.cz/zakladni?q=${lat}%C2%B0%20${lon}%C2%B0`,
    },
    {
      label: 'Google Maps',
      href: `https://google.com/maps/search/${lat}%C2%B0%20${lon}%C2%B0/@${lat},${lon},${zoomInt}z`,
    },
    {
      label: 'iD editor',
      href: getIdEditorLink(feature, view), // TODO coordsFeature has random id which gets forwarded LOL
    },
    ...(isIOS()
      ? [
          {
            label: 'Apple maps',
            href: getAppleMapsLink(feature, position, activeLayers),
          },
        ]
      : []),
    ...(isMobileDevice()
      ? [
          {
            label: t('coordinates.geo_uri'),
            href: `geo:${lat},${lon}`,
          },
        ]
      : []),
  ];
};
