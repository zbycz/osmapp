import ExploreIcon from '@material-ui/icons/Explore';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import MapIcon from '@material-ui/icons/Map';
import SatelliteIcon from '@material-ui/icons/Satellite';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import { Layer } from '../utils/MapStateContext';

interface Layers {
  [key: string]: Layer;
}

const retina = (window.devicePixelRatio || 1) >= 2 ? '@2x' : '';

export const osmappLayers: Layers = {
  basic: { name: 'Základní', type: 'basemap', Icon: ExploreIcon },
  outdoor: { name: 'Outdoorová', type: 'basemap', Icon: FilterHdrIcon },
  s1: { type: 'spacer' },
  mapnik: {
    name: 'OSM Mapnik',
    type: 'basemap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    Icon: MapIcon,
  },
  sat: {
    name: 'Satelitní',
    type: 'basemap',
    url: 'https://api.maptiler.com/tiles/satellite/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    Icon: SatelliteIcon,
  },
  // mtb: {
  //   name: 'MTB',
  //   type: 'basemap',
  //   url: 'https://openstreetmap.cz/proxy.php/tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', // TODO proxy
  // },
  bike: {
    name: 'Cyklo',
    type: 'basemap',
    url: `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}${retina}.png?apikey=00291b657a5d4c91bbacb0ff096e2c25`,
    Icon: DirectionsBikeIcon,
  },
  // snow: {
  //   name: 'Zimní',
  //   type: 'basemap',
  //   url: 'https://www.opensnowmap.org/tiles-pistes/{z}/{x}/{y}.png',
  // },
  // s2: { type: 'spacer' },
  // c: { name: 'Vrstevnice', type: 'overlay' },
  // h: { name: 'Stínování kopců', type: 'overlay' },
  // p: { name: 'Ikonky (POI)', type: 'overlay' },
  // l: { name: 'Popisky', type: 'overlay' },
  // s3: { type: 'spacer' },
};
