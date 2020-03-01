// @flow

import mapboxStyle from './mapboxStyle';

export const sources = {
  openmaptiles: {
    type: 'vector',
    url:
      'https://api.maptiler.com/tiles/v3/tiles.json?key=7dlhLl3hiXQ1gsth0kGu', // https://cloud.maptiler.com/account
  },
  contours: {
    type: 'vector',
    url:
      'https://api.maptiler.com/tiles/contours/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
  },
  hillshading: {
    type: 'raster',
    url:
      'https://api.maptiler.com/tiles/hillshades/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    tileSize: 256,
  },
  osm_mapnik: {
    type: 'raster',
    tiles: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ],
    tileSize: 256,
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

  // {
  //   'id': 'contours',
  //   'type': 'line',
  //   'source': 'contours',
  //   'source-layer': 'contour',
  //   'layout': {
  //     'visibility': 'visible',
  //     'line-join': 'round',
  //     'line-cap': 'round'
  //   },
  //   'paint': {
  //     'line-color': '#877b59',
  //     'line-width': 1
  //   }
  // },
  // {
  //   'id': 'hillshading',
  //   'source': 'dem',
  //   'type': 'hillshade'
  // },
];

function addHoverPaint(origStyle) {
  const value = [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    0.5,
    1,
  ];
  origStyle.layers
    .filter(x => x.id.match(/^poi-/))
    .forEach(x => {
      if (x.paint) {
        x.paint['icon-opacity'] = value;
      }
    });
  return origStyle;
}

const origStyle = mapboxStyle(sources, backgroundLayers);
export const style = addHoverPaint(origStyle);

const backgroundIds = backgroundLayers.map(x => x.id);
const hoverLayers = style.layers
  .map(x => x.id)
  .filter(x => !(x in backgroundIds));

export const setUpHover = map => {
  let lastHover = null;
  const setHover = (f, hover) => f && map.setFeatureState(f, { hover });
  const setHoverOn = f => setHover(f, true);
  const setHoverOff = f => setHover(f, false);
  const onMouseMove = e => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      if (feature !== lastHover) {
        setHoverOff(lastHover);
        setHoverOn(feature);
        lastHover = feature;
        map.getCanvas().style.cursor = 'pointer';
      }
    }
  };
  const onMouseLeave = () => {
    setHoverOff(lastHover);
    lastHover = null;
    map.getCanvas().style.cursor = ''; // TODO delay 200ms
  };
  hoverLayers.forEach(x => {
    map.on('mousemove', x, onMouseMove);
    map.on('mouseleave', x, onMouseLeave);
  });
};
