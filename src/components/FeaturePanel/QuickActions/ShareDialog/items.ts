import { isIOS } from '../../../../helpers/platforms';
import { t } from '../../../../services/intl';
import { PositionBoth } from '../../../../services/types';
import { isMobileDevice } from '../../../helpers';

type ImageAttribution = {
  href: string;
  label: string;
};

export const imageAttributions: ImageAttribution[] = [
  {
    href: 'https://commons.wikimedia.org/wiki/File:Openstreetmap_logo.svg',
    label: 'Wikimedia Commons (OpenStreetMap logo)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:AppleMaps_logo.svg',
    label: 'Wikimedia Commons (Apple Maps logo)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:Google_Maps_icon_(2020).svg',
    label: 'Wikimedia Commons (Google Maps logo)',
  },
];

type ExternalMapLink = {
  label: string;
  href: string;
  image?: string;
};

type ItemArgs = {
  osmQuery: string;
  appleMaps: string;
  idEditor: string;
  position: PositionBoth;
  zoomInt: number;
  isSateliteActive: boolean;
};

export const items = ({
  osmQuery,
  appleMaps,
  idEditor,
  position: [lon, lat],
  zoomInt,
  isSateliteActive,
}: ItemArgs): ExternalMapLink[] => [
  {
    label: 'OpenStreetMap.org',
    href: `https://openstreetmap.org/${osmQuery}`,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg',
  },
  ...(isIOS()
    ? [
        {
          label: 'Apple maps',
          href: appleMaps,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/1/17/AppleMaps_logo.svg',
        },
      ]
    : []),
  {
    label: 'Google Maps',
    // https://developers.google.com/maps/documentation/urls/get-started#map-action
    href:
      `https://www.google.com/maps/@?api=1` +
      '&map_action=map' +
      `&center=${lat},${lon}` +
      `&zoom=${zoomInt}` +
      `&basemap=${isSateliteActive ? 'satellite' : 'roadmap'}`,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg',
  },
  {
    label: 'Mapy.cz',
    href: `https://mapy.cz/zakladni?q=${lat}%C2%B0%20${lon}%C2%B0`,
  },
  ...(isMobileDevice()
    ? [
        {
          label: t('coordinates.geo_uri'),
          href: `geo:${lat},${lon}`,
        },
      ]
    : []),
  {
    label: 'OpenStreetMap.cz',
    href: `https://openstreetmap.cz/${osmQuery}`,
  },
  {
    label: 'iD editor',
    href: idEditor,
  },
];
