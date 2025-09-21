import { isIOS } from '../../../../helpers/platforms';
import { t } from '../../../../services/intl';
import { LonLatBoth } from '../../../../services/types';
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
  position: LonLatBoth;
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
          image: '/share-icons/osm.webp',
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
    image: '/share-icons/google-maps.webp',
  },
  {
    label: 'Mapy.com',
    href: `https://mapy.com/turisticka?q=${lat}%C2%B0%20${lon}%C2%B0`,
    image: '/share-icons/mapy-com.webp',
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
    label: 'iD editor',
    href: idEditor,
  },
];
