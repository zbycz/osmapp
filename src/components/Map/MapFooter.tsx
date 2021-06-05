import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import getConfig from 'next/config';
import { Menu, MenuItem, Tooltip } from '@material-ui/core';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { changeLang, intl, t } from '../../services/intl';
import { getIdEditorLink } from '../helpers';
import GithubIcon from '../../assets/GithubIcon';

const {
  publicRuntimeConfig: { osmappVersion, commitHash, commitMessage },
} = getConfig();

const Box = styled.div`
  margin-top: 10px;
  padding: 2px;
  font-size: 12px;
  line-height: normal;
  color: #000;
  background-color: #f8f4f0; /* same as osm-bright */

  svg {
    vertical-align: -2px;
    margin-right: 4px;
  }
`;

const OsmappLink = () => {
  const { showHomepage } = useFeatureContext();

  const handleClick = (e) => {
    e.preventDefault();
    showHomepage();
  };
  return (
    <>
      <Tooltip arrow title="Github">
        <a
          href="https://github.com/zbycz/osmapp"
          target="_blank"
          rel="noopener"
          aria-label="Github"
        >
          <GithubIcon width="12" height="12" />
        </a>
      </Tooltip>
      <Tooltip arrow title={t('map.about_title')}>
        <button type="button" className="linkLikeButton" onClick={handleClick}>
          osmapp
        </button>
      </Tooltip>{' '}
      <span title={`${commitHash} ${commitMessage}`}>{osmappVersion}</span>
    </>
  );
};

const LangSwitcher = () => {
  const {
    publicRuntimeConfig: { languages },
  } = getConfig();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setLang = (k) => {
    changeLang(k);
    handleClose();
  };

  return (
    <>
      <Menu
        id="language-switcher"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.entries(languages).map(([k, name]) => (
          <MenuItem key={k} onClick={() => setLang(k)}>
            {name}
          </MenuItem>
        ))}
      </Menu>
      <Tooltip arrow title={t('map.language_title')}>
        <button
          type="button"
          className="linkLikeButton"
          aria-controls="language-switcher"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {languages[intl.lang]}
        </button>
      </Tooltip>
    </>
  );
};

const EditLink = () => {
  // fixes hydration error - server and browser have different view (cookies and window.hash)
  // throwed "Warning: Prop `href` did not match."
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(true);
  }, []);

  const { view } = useMapStateContext();
  const { feature } = useFeatureContext();
  const href = getIdEditorLink(feature, browser ? view : []);
  return (
    <Tooltip arrow title={t('map.edit_button_title')}>
      <a href={href} target="_blank" rel="noopener">
        {t('map.edit_button')}
      </a>
    </Tooltip>
  );
};

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
  <Box>
    <OsmappLink />
    {' | '}
    <LangSwitcher />
    {' | '}
    <MapDataLink />
    {' | '}
    <EditLink />
  </Box>
);
