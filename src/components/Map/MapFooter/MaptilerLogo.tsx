import React from 'react';
import styled from 'styled-components';
import { useMapStateContext } from '../../utils/MapStateContext';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';

const Link = styled.a`
  position: absolute;
  right: 8px;
  bottom: 19px;
  z-index: 999;
`;

export const MaptilerLogo = () => {
  const { activeLayers } = useMapStateContext();
  const hasMaptiler = activeLayers.some((layer) => {
    const attribution = osmappLayers[layer]?.attribution;

    return Array.isArray(attribution) && attribution.includes('maptiler');
  });

  if (!hasMaptiler) {
    return null;
  }

  return (
    <Link href="https://www.maptiler.com" rel="noopener" target="_blank">
      <img
        src="/logo/maptiler-api.svg"
        alt="MapTiler logo"
        width={67}
        height={20}
      />
    </Link>
  );
};
