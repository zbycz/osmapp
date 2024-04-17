import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import getConfig from 'next/config';
import { Tooltip, useMediaQuery } from '@material-ui/core';
import uniq from 'lodash/uniq';
import { t, Translation } from '../../../services/intl';
import GithubIcon from '../../../assets/GithubIcon';
import { LangSwitcher } from './LangSwitcher';
import { useMapStateContext } from '../../utils/MapStateContext';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';

const {
  publicRuntimeConfig: { osmappVersion, commitHash, commitMessage },
} = getConfig();

const StyledGithubIcon = styled(GithubIcon)`
  filter: ${({ theme }) => theme.palette.invertFilter};
`;

const Wrapper = styled.div`
  margin-top: 10px;
  padding: 0 2px;
  font-size: 12px;
  line-height: normal;
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) => theme.palette.background.paper};
  letter-spacing: normal;
  font-weight: 400;
  margin-left: 30px;

  svg {
    vertical-align: -2px;
    margin-right: 4px;
  }

  a,
  button {
    padding: 2px 0;
  }
`;

const OsmappLink = () => (
  <>
    <a
      href="https://github.com/zbycz/osmapp"
      target="_blank"
      rel="noopener"
      title={t('map.github_title')}
    >
      <StyledGithubIcon width="12" height="12" />
      osmapp
    </a>{' '}
    <span title={`${commitHash} ${commitMessage}`}>{osmappVersion}</span>
  </>
);

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

export const MapFooter = () => (
  // TODO find a way how to render this in SSR (keep layer in cookies?)
  <ClientOnly>
    <Wrapper>
      <OsmappLink />
      {' | '}
      <LangSwitcher />
      {' | '}
      <MapDataLink />
    </Wrapper>
  </ClientOnly>
);
