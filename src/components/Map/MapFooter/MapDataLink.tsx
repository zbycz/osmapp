import React from 'react';
import { useMediaQuery } from '@mui/material';
import uniq from 'lodash/uniq';
import { Translation } from '../../../services/intl';
import { useMapStateContext } from '../../utils/MapStateContext';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { Attribution } from './AttributionLinks';

export const MapDataLink = () => {
  const short = useMediaQuery('(max-width: 500px)');
  const { activeLayers } = useMapStateContext();
  const attributions = uniq(
    activeLayers.flatMap((layer) =>
      osmappLayers[layer]
        ? osmappLayers[layer].attribution
        : decodeURI(new URL(layer)?.hostname),
    ),
  );

  const nodes = attributions.map((attribution) => {
    if (attribution === 'maptiler')
      return (
        <Attribution
          key={attribution}
          label="MapTiler"
          link="https://www.maptiler.com/"
          title={<Translation id="map.maptiler_copyright_tooltip" />}
        />
      );
    if (attribution === 'osm')
      return (
        <Attribution
          key={attribution}
          label={short ? 'OSM' : 'OpenStreetMap'}
          link="https://www.openstreetmap.org/"
          title={<Translation id="map.osm_copyright_tooltip" />}
        />
      );

    return (
      <span
        key={attribution}
        dangerouslySetInnerHTML={{ __html: attribution }} // eslint-disable-line react/no-danger
      />
    );
  });

  // place a space between attributions
  for (let i = 1; i < nodes.length; i += 2) {
    nodes.splice(i, 0, ' ');
  }

  return nodes;
};
