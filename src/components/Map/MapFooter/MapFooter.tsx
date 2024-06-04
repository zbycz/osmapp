import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IconButton, Tooltip, useMediaQuery } from '@material-ui/core';
import uniq from 'lodash/uniq';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Translation } from '../../../services/intl';
import { useMapStateContext } from '../../utils/MapStateContext';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';

const IconContainer = styled.div`
  width: 20px;
  height: 20px;
`;

const StyledIconButton = styled(IconButton)`
  position: relative;
  top: -3px;
`;

const Wrapper = styled.div`
  padding: 0 2px;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.primary};
  font-weight: 400;
  text-align: left;
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.palette.text.primary};
    text-decoration: underline;
  }
`;

const Attribution = ({ label, link, title }) => (
  <>
    ©{' '}
    <Tooltip arrow title={title}>
      <a href={link} target="_blank" rel="noopener">
        {label}
      </a>
    </Tooltip>
  </>
);

const MapDataLink = () => {
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

const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
};

export const MapFooter = ({ isLegendVisible, setIsLegendVisible }) => (
  // TODO find a way how to render this in SSR (keep layer in cookies?)
  <ClientOnly>
    <Wrapper>
      <div>
        <MapDataLink />
      </div>
      <IconContainer>
        {!isLegendVisible && (
          <Tooltip title="Show climbing legend" enterDelay={1000}>
            <StyledIconButton
              size="small"
              edge="end"
              onClick={() => {
                setIsLegendVisible(true);
              }}
            >
              <KeyboardArrowUpIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
        )}
      </IconContainer>
    </Wrapper>
  </ClientOnly>
);
