import ExploreIcon from '@material-ui/icons/Explore';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import MapIcon from '@material-ui/icons/Map';
import SatelliteIcon from '@material-ui/icons/Satellite';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import { Layer } from '../utils/MapStateContext';
import { t } from '../../services/intl';

interface Layers {
  [key: string]: Layer;
}

const retina = (window.devicePixelRatio || 1) >= 2 ? '@2x' : '';

export const osmappLayers: Layers = {
  basic: { name: t('layers.basic'), type: 'basemap', Icon: ExploreIcon },
  outdoor: { name: t('layers.outdoor'), type: 'basemap', Icon: FilterHdrIcon },
  s1: { type: 'spacer' },
  mapnik: {
    name: t('layers.mapnik'),
    type: 'basemap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    Icon: MapIcon,
  },
  sat: {
    name: t('layers.sat'),
    type: 'basemap',
    url: 'https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    Icon: SatelliteIcon,
  },
  // mtb: {
  //   name: t('layers.mtb'),
  //   type: 'basemap',
  //   url: 'https://openstreetmap.cz/proxy.php/tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', // TODO proxy
  // },
  bike: {
    name: t('layers.bike'),
    type: 'basemap',
    url: `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}${retina}.png?apikey=00291b657a5d4c91bbacb0ff096e2c25`,
    Icon: DirectionsBikeIcon,
  },
  // snow: {
  //   name: t('layers.snow'),
  //   type: 'basemap',
  //   url: 'https://www.opensnowmap.org/tiles-pistes/{z}/{x}/{y}.png',
  // },
  // s2: { type: 'spacer' },
  // c: { name: 'Vrstevnice/Contours', type: 'overlay' },
  // h: { name: 'Stínování kopců/Hillshading', type: 'overlay' },
  // p: { name: 'Ikonky (POI)', type: 'overlay' },
  // l: { name: 'Popisky/Labels', type: 'overlay' },
  // s3: { type: 'spacer' },
};
