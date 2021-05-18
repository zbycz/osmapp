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

const addHoverPaint = (origStyle) => {
  const hoverExpr = ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 1]; // prettier-ignore
  const iconOpacity = ['case', ['boolean', ['feature-state', 'hideIcon'], false], 0, hoverExpr]; // prettier-ignore

  origStyle.layers
    .filter((layer) => layer.id.match(/^poi-/))
    .forEach((layer) => {
      if (layer.paint) {
        layer.paint['icon-opacity'] = iconOpacity; // eslint-disable-line no-param-reassign
      }
    });

  return origStyle;
};

const sprite = `${window.location.protocol}//${window.location.host}/sprites/osmapp`;

const origStyle = mapboxStyle(sources, backgroundLayers, sprite);
export const style = addHoverPaint(origStyle);

const isOsmLayer = (id) => {
  const prefixes = ['water-name-', 'poi-', 'place-'];
  return prefixes.some((prefix) => id.startsWith(prefix));
};
export const layersWithOsmId = style.layers
  .map((x) => x.id)
  .filter((id) => isOsmLayer(id));

export const setUpHover = (map) => {
  let lastHover = null;

  const setHover = (feature, hover) =>
    feature && map.setFeatureState(feature, { hover });
  const setHoverOn = (feature) => setHover(feature, true);
  const setHoverOff = (feature) => setHover(feature, false);

  const onMouseMove = (e) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      if (feature !== lastHover) {
        setHoverOff(lastHover);
        setHoverOn(feature);
        lastHover = feature;
        map.getCanvas().style.cursor = 'pointer'; // eslint-disable-line no-param-reassign
      }
    }
  };

  const onMouseLeave = () => {
    setHoverOff(lastHover);
    lastHover = null;
    // TODO delay 200ms
    map.getCanvas().style.cursor = ''; // eslint-disable-line no-param-reassign
  };

  layersWithOsmId.forEach((layer) => {
    map.on('mousemove', layer, onMouseMove);
    map.on('mouseleave', layer, onMouseLeave);
  });
};
