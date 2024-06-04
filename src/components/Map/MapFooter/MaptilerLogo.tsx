import React from 'react';
import styled from 'styled-components';
import { useMapStateContext } from '../../utils/MapStateContext';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';

const Link = styled.a`
  pointer-events: all;
`;

export const MaptilerLogo = () => {
  const { activeLayers } = useMapStateContext();
  const hasMaptiler = activeLayers.some((layer) =>
    osmappLayers[layer]?.attribution?.includes('maptiler'),
  );

  if (!hasMaptiler) {
    return null;
  }

  return (
    <Link href="https://www.maptiler.com" target="_blank">
      <img src="/maptiler-api.svg" alt="MapTiler logo" width={67} height={20} />
    </Link>
  );
};
