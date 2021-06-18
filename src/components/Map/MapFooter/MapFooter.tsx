import React from 'react';
import styled from 'styled-components';
import getConfig from 'next/config';
import { Tooltip } from '@material-ui/core';
import { t } from '../../../services/intl';
import GithubIcon from '../../../assets/GithubIcon';
import { MoreMenu } from './MoreMenu';
import { LangSwitcher } from './LangSwitcher';

const {
  publicRuntimeConfig: { osmappVersion, commitHash, commitMessage },
} = getConfig();

const Wrapper = styled.div`
  margin-top: 10px;
  padding: 2px;
  font-size: 12px;
  line-height: normal;
  color: #000;
  background-color: #f8f4f0; /* same as osm-bright */
  letter-spacing: normal;
  font-weight: 400;

  svg {
    vertical-align: -2px;
    margin-right: 4px;
  }
`;

const OsmappLink = () => (
  <>
    <Tooltip arrow title={t('map.github_title')}>
      <a href="https://github.com/zbycz/osmapp" target="_blank" rel="noopener">
        <GithubIcon width="12" height="12" />
        osmapp
      </a>
    </Tooltip>{' '}
    <span title={`${commitHash} ${commitMessage}`}>{osmappVersion}</span>
  </>
);

const MapDataLink = () => (
  <>
    {'© '}
    <Tooltip arrow title={t('map.copyright')}>
      <button
        type="button"
        className="linkLikeButton"
        // eslint-disable-next-line no-alert
        onClick={() => alert(t('map.copyright'))}
      >
        {t('map.map_data_button')}
      </button>
    </Tooltip>
  </>
);

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
