// @flow

import * as React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import mapboxStyle from './mapboxStyle';
import { fetchElement } from '../../services/osmApi';
import { getHumanReadable, getOsmShortId } from './helpers';

const layers = [
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

const sources = {
  openmaptiles: {
    type: 'vector',
    url: 'https://maps.tilehosting.com/data/v3.json?key=7dlhLl3hiXQ1gsth0kGu', // https://cloud.maptiler.com/account
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

async function getFeature(osmShortId) {
  const osmXml = await fetchElement(osmShortId);

  const item = osmXml.getElementsByTagName('osm')[0];
  const tags = item.getElementsByTagName('tag');
  const properties = {};
  for (let i = 0; i < tags.length; i++) {
    const x = tags[i];
    properties[x.getAttribute('k')] = x.getAttribute('v');
  }

  const feature = {
    lat: item.getAttribute('lat'),
    lon: item.getAttribute('lon'),
    properties,
  };
  return feature;
}

class BrowserMap extends React.Component {
  constructor() {
    super();
    this.mapRef = React.createRef();
    this.map = null;
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: mapboxStyle({ sources, layers }),
      center: [14.38906, 50.10062],
      zoom: 17,
      attributionControl: false,
    });

    // TODO https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
    this.map.on('click', async e => {
      const features = this.map.queryRenderedFeatures(e.point);
      const osmShortId = getOsmShortId(features);

      if (osmShortId) {
        console.log(`clicked ${osmShortId}`, getHumanReadable(features)); // eslint-disable-line no-console
        const feature = await getFeature(osmShortId);
        console.log('fetched', feature); // eslint-disable-line no-console
        this.props.onFeatureClicked(feature);
      }
    });
  }

  componentWillUnmount() {
    if (this.map) this.map.remove();
  }

  render() {
    return (
      <>
        <div ref={this.mapRef} style={{ height: '100%', width: '100%' }} />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </>
    );
  }
}

export default BrowserMap;
