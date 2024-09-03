import { Tooltip, useMediaQuery } from '@mui/material';
import React from 'react';
import uniq from 'lodash/uniq';
import { Layer, useMapStateContext } from '../../utils/MapStateContext';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { Translation } from '../../../services/intl';
import { usePersistedState } from '../../utils/usePersistedState';

export const Attribution = ({ label, link, title }) => (
  <>
    ©{' '}
    <Tooltip arrow title={title}>
      <a href={link} target="_blank" rel="noopener">
        {label}
      </a>
    </Tooltip>
  </>
);

const MaptilerAttribution = () => (
  <Attribution
    label="MapTiler"
    link="https://www.maptiler.com/"
    title={<Translation id="map.maptiler_copyright_tooltip" />}
  />
);

const OsmAttribution = () => {
  const short = useMediaQuery('(max-width: 500px)');

  return (
    <Attribution
      label={short ? 'OSM' : 'OpenStreetMap'}
      link="https://www.openstreetmap.org/"
      title={<Translation id="map.osm_copyright_tooltip" />}
    />
  );
};

export const AttributionLinks = () => {
  const { activeLayers } = useMapStateContext();
  const [userLayers] = usePersistedState<Layer[]>('userLayers', []);

  const attributions: string[] = uniq(
    activeLayers.flatMap((layerUrl) => {
      const osmappLayer = osmappLayers[layerUrl];
      if (osmappLayer) return osmappLayer.attribution;

      const userLayer = userLayers.find(({ url }) => url === layerUrl);
      return userLayer?.attribution || decodeURI(new URL(layerUrl)?.hostname);
    }),
  );

  const nodes: React.ReactNode[] = attributions.map((attribution) => {
    if (attribution === 'maptiler') {
      return <MaptilerAttribution key="maptiler" />;
    }
    if (attribution === 'osm') {
      return <OsmAttribution key="osm" />;
    }

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

  return <div>{nodes}</div>;
};
