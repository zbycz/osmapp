import { isIOS } from '../../../../helpers/platforms';
import { Theme } from '../../../../helpers/theme';
import { getFullOsmappLink, getShortLink } from '../../../../services/helpers';
import { t } from '../../../../services/intl';
import {
  Feature,
  LonLat,
  LonLatRounded,
  PositionBoth,
} from '../../../../services/types';
import { positionToDeg, positionToDM } from '../../../../utils';
import { isMobileDevice } from '../../../helpers';

type ImageAttribution = {
  href: string;
  label: string;
};

export const imageAttributions: ImageAttribution[] = [
  {
    href: 'https://thenounproject.com/icon/mapping-4733828/',
    label: 'WEBTECHSHOPS from Noun Project (GeoURI)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:Openstreetmap_logo.svg',
    label: 'Wikimedia Commons (OpenStreetMap)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:AppleMaps_logo.svg',
    label: 'wikimedia Commons (Apple)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:Google_Maps_icon_(2020).svg',
    label: 'wikimedia Commons (Google)',
  },
  {
    href: 'https://www.ranklogos.com/websites-logos/mapy-cz-logo/',
    label: 'Mapy.cz',
  },
];

export const shareItems = (
  feature: Feature | null,
  center: LonLatRounded | LonLat,
) =>
  [
    getShortLink(feature),
    getFullOsmappLink(feature),
    positionToDeg(center),
    positionToDM(center),
  ].filter((s) => s);

type PrimaryItem = {
  image: string;
  label: string;
  invert?: Theme;
} & ({ href: string } | { shareUrl: string });

export const primaryItems = ({
  feature,
  osmQuery,
  zoomInt,
  position: [lon, lat],
  appleMaps,
}: {
  feature: Feature;
  osmQuery: string;
  zoomInt: number;
  position: PositionBoth;
  appleMaps: string;
}): PrimaryItem[] => [
  ...(isMobileDevice()
    ? [
        {
          image: '/geouri.svg',
          invert: 'dark' as const,
          label: 'Map App',
          href: `geo:${lat},${lon}`,
        },
      ]
    : []),
  {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png?20220919103849',
    label: 'OSM',
    href: `https://openstreetmap.org/${osmQuery}`,
  },
  {
    image: '/osmapp/logo/osmapp_logo_square.svg',
    label: 'OsmAPP',
    shareUrl: getShortLink(feature) ?? getFullOsmappLink(feature),
  },
  {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/418px-Google_Maps_icon_%282020%29.svg.png?20200218211225',
    label: 'Google',
    href: `https://google.com/maps/search/${lat}%C2%B0%20${lon}%C2%B0/@${lat},${lon},${zoomInt}z`,
  },
  ...(isIOS()
    ? [
        {
          image:
            'https://upload.wikimedia.org/wikipedia/commons/1/17/AppleMaps_logo.svg',
          label: 'Apple',
          href: appleMaps,
        },
      ]
    : []),
  {
    image:
      'https://www.ranklogos.com/wp-content/uploads/2016/09/Mapy-cz-Logo.png',
    label: 'Mapy.cz',
    href: `https://mapy.cz/zakladni?q=${lat}%C2%B0%20${lon}%C2%B0`,
  },
];

type ExternalMapLink = {
  label: string;
  href: string;
};

export const items = ({
  osmQuery,
  appleMaps,
  idEditor,
  position: [lon, lat],
  zoomInt,
}: {
  osmQuery: string;
  appleMaps: string;
  idEditor: string;
  position: PositionBoth;
  zoomInt: number;
}): ExternalMapLink[] => [
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
    href: idEditor,
  },
  ...(isIOS()
    ? [
        {
          label: 'Apple maps',
          href: appleMaps,
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
