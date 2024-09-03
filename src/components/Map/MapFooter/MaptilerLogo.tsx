import React from 'react';
import styled from '@emotion/styled';
import { useMapStateContext } from '../../utils/MapStateContext';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { useIsClient } from '../../helpers';

const Link = styled.a`
  pointer-events: all;
  margin-right: 2px;
`;

export const MaptilerLogo = () => {
  const isClient = useIsClient();
  const { activeLayers } = useMapStateContext();
  const hasMaptiler = activeLayers.some((layer) => {
    const attribution = osmappLayers[layer]?.attribution;

    return Array.isArray(attribution) && attribution.includes('maptiler');
  });

  if (!isClient || !hasMaptiler) {
    return null;
  }

  return (
    <Link href="https://www.maptiler.com" target="_blank">
      <img src="/maptiler-api.svg" alt="MapTiler logo" width={67} height={20} />
    </Link>
  );
};
