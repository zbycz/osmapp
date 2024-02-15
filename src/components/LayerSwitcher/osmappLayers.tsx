import ExploreIcon from '@mui/icons-material/Explore';
import FilterHdrIcon from '@mui/icons-material/FilterHdr';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { Layer } from '../utils/MapStateContext';
import { t } from '../../services/intl';
import { isBrowser } from '../helpers';

interface Layers {
  [key: string]: Layer;
}

const retina =
  ((isBrowser() && window.devicePixelRatio) || 1) >= 2 ? '@2x' : '';

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
  },
  outdoor: {
    name: t('layers.outdoor'),
    type: 'basemap',
    Icon: FilterHdrIcon,
    attribution: ['maptiler', 'osm'],
  },
  s1: { type: 'spacer' },
  mapnik: {
    name: t('layers.mapnik'),
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
  // snow: {
  //   name: t('layers.snow'),
  //   type: 'overlay',
  //   url: 'https://www.opensnowmap.org/tiles-pistes/{z}/{x}/{y}.png',
  // },
  // s2: { type: 'spacer' },
  // c: { name: 'Vrstevnice/Contours', type: 'overlay' },
  // h: { name: 'Stínování kopců/Hillshading', type: 'overlay' },
  // p: { name: 'Ikonky (POI)', type: 'overlay' },
  // l: { name: 'Popisky/Labels', type: 'overlay' },
  // s3: { type: 'spacer' },
};
