// @flow

import * as React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import mapboxStyle from './mapboxStyle';
import { dumpFeatures, getFeatureFromMap, getOsmId } from './helpers';
import { getFeatureFromApi } from '../../services/osmApi';

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

class BrowserMap extends React.Component {
  mapRef = React.createRef();
  map = null;

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
      const point = e.point;
      const coords = this.map.unproject(point).toArray();
      const features = this.map.queryRenderedFeatures(point);
      const osmApiId = getOsmId(features);

      if (osmApiId) {
        console.log(`clicked ${osmApiId}`, dumpFeatures(features)); // eslint-disable-line no-console
        this.props.onFeatureClicked(await getFeatureFromMap(features, coords));
        this.props.onFeatureClicked(await getFeatureFromApi(osmApiId));
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
