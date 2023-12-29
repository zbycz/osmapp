import React from 'react';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ExploreIcon from '@mui/icons-material/Explore';
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { Layer } from '../utils/MapStateContext';
import { t } from '../../services/intl';
import { isBrowser } from '../helpers';
import Maki from '../utils/Maki';
import { useUserThemeContext } from '../../helpers/theme';

interface Layers {
  [key: string]: Layer;
}

const retina =
  ((isBrowser() && window.devicePixelRatio) || 1) >= 2 ? '@2x' : '';

const ClimbingIcon = () => {
  const { currentTheme } = useUserThemeContext();
  return (
    <Maki
      ico="climbing"
      size={16}
      style={{ opacity: 0.3, marginLeft: '3px' }}
      invert={currentTheme === 'dark'}
    />
  );
};

const africaBbox = [
  -20, // west
  -35, // south
  55, // east
  40, // north
];

const czBbox = [
  12.09, // west
  48.55, // south
  18.87, // east
  51.06, // north
];

export const osmappLayers: Layers = {
  basic: {
    name: t('layers.basic'),
    type: 'basemap',
    Icon: ExploreIcon,
    attribution: ['maptiler', 'osm'],
  },
  makinaAfrica: {
    name: t('layers.makina_africa'),
    type: 'basemap',
    Icon: ExploreIcon,
    attribution: [
      '<a href="https://openplaceguide.org/">OPG</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a>',
      'osm',
    ],
    bbox: africaBbox,
  },
  outdoor: {
    name: t('layers.outdoor'),
    type: 'basemap',
    Icon: FilterHdrIcon,
    attribution: ['maptiler', 'osm'],
  },
  s1: { type: 'spacer' },
  carto: {
    name: t('layers.carto'),
    type: 'basemap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    Icon: MapIcon,
    attribution: ['osm'],
  },
  sat: {
    name: t('layers.maptilerSat'),
    type: 'basemap',
    url: 'https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    Icon: SatelliteIcon,
    attribution: ['maptiler'],
  },
  bingSat: {
    name: t('layers.bingSat'),
    type: 'basemap',
    url: 'https://ecn.{bingSubdomains}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=13657',
    Icon: SatelliteIcon,
    attribution: ['&copy; <a href="https://www.bing.com/maps">Microsoft</a>'],
    maxzoom: 19,
  },
  cuzkSat: {
    name: 'ČÚZK ortofoto (CZ)',
    type: 'basemap',
    url: 'https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/service.svc/get?FORMAT=image/png&TRANSPARENT=TRUE&VERSION=1.3.0&SERVICE=WMS&REQUEST=GetMap&LAYERS=GR_ORTFOTORGB&STYLES=&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
    Icon: SatelliteIcon,
    attribution: ['&copy; <a href="https://geoportal.cuzk.cz">ČÚZK</a>'],
    bbox: czBbox,
  },
  // mtb: {
  //   name: t('layers.mtb'),
  //   type: 'basemap',
  //   url: 'https://openstreetmap.cz/proxy.php/tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', // TODO proxy
  // },
  bike: {
    name: t('layers.bike'),
    type: 'basemap',
    url: `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}${retina}.png?apikey=18c0cb31f2fd41d28ac90abe4059e359`,
    Icon: DirectionsBikeIcon,
    attribution: [
      '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>',
      'osm',
    ],
  },
  snow: {
    name: t('layers.snow'),
    type: 'overlay',
    url: 'https://www.opensnowmap.org/tiles-pistes/{z}/{x}/{y}.png',
    Icon: AcUnitIcon,
    attribution: [
      '&copy; <a href="https://www.opensnowmap.org/">opensnowmap.org</a>',
      'osm',
    ],
  },
  climbing: {
    name: t('layers.climbing'),
    type: 'overlayClimbing',
    Icon: ClimbingIcon,
    attribution: ['osm'],
  },
};
