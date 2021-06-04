export const sources = {
  maptiler_planet: {
    type: 'vector',
    url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=7dlhLl3hiXQ1gsth0kGu', // https://cloud.maptiler.com/account
  },
  contours: {
    type: 'vector',
    url: 'https://api.maptiler.com/tiles/contours/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
  },
  hillshading: {
    type: 'raster',
    url: 'https://api.maptiler.com/tiles/hillshades/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    tileSize: 256,
  },
  'terrain-rgb': {
    url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    type: 'raster-dem',
  },
  outdoor: {
    url: 'https://api.maptiler.com/tiles/outdoor/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    type: 'vector',
  },
};
export const backgroundLayers = [
  // {
  //     "id": "simple-tiles",
  //     "type": "raster",
  //     "source": "osm_mapnik",
  //     "minzoom": 0,
  //     "maxzoom": 22
  // },
  {
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#f8f4f0',
    },
  },
];
export const sprite = `${window.location.protocol}//${window.location.host}/sprites/osmapp`;
