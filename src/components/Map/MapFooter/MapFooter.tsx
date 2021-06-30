import React from 'react';
import styled from 'styled-components';
import getConfig from 'next/config';
import { Tooltip, useMediaQuery } from '@material-ui/core';
import { t, Translation } from '../../../services/intl';
import GithubIcon from '../../../assets/GithubIcon';
import { MoreMenu } from './MoreMenu';
import { LangSwitcher } from './LangSwitcher';

const {
  publicRuntimeConfig: { osmappVersion, commitHash, commitMessage },
} = getConfig();

const Wrapper = styled.div`
  margin-top: 10px;
  padding: 0 2px;
  font-size: 12px;
  line-height: normal;
  color: #000;
  background-color: #f8f4f0; /* same as osm-bright */
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
      <GithubIcon width="12" height="12" />
      osmapp
    </a>{' '}
    <span title={`${commitHash} ${commitMessage}`}>{osmappVersion}</span>
  </>
);

const MapDataLink = () => {
  const short = useMediaQuery('(max-width: 500px)');

  return (
    <>
      ©{' '}
      <Tooltip
        arrow
        title={<Translation id="map.maptiler_copyright_tooltip" />}
      >
        <a
          href="https://www.maptiler.com/copyright/"
          target="_blank"
          rel="noopener"
        >
          MapTiler
        </a>
      </Tooltip>{' '}
      ©{' '}
      <Tooltip arrow title={<Translation id="map.osm_copyright_tooltip" />}>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
        >
          {short ? 'OSM' : 'OpenStreetMap'}
        </a>
      </Tooltip>
    </>
  );
};

export const MapFooter = () => (
  <Wrapper>
    <OsmappLink />
    {' | '}
    <LangSwitcher />
    {' | '}
    <MapDataLink />
    {' | '}
    <MoreMenu />
  </Wrapper>
);
