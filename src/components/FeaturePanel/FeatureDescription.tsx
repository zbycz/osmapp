import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { capitalize } from '../helpers';
import { t, Translation } from '../../services/intl';
import { useFeatureContext } from '../utils/FeatureContext';
import { TooltipButton } from '../utils/TooltipButton';
import { Feature } from '../../services/types';
import { OSM_WEBSITE } from '../../services/osm/consts';

const A = ({ href, children }) =>
  href ? (
    <a href={href} target="_blank">
      {children}
    </a>
  ) : (
    children
  );

const getUrls = ({ type, id, changeset, user }: Feature['osmMeta']) => ({
  itemUrl: `${OSM_WEBSITE}/${type}/${id}`,
  historyUrl: `${OSM_WEBSITE}/${type}/${id}/history`,
  changesetUrl: changeset && `${OSM_WEBSITE}/changeset/${changeset}`, // prettier-ignore
  userUrl: user && `${OSM_WEBSITE}/user/${user}`,
});

const Urls = () => {
  const {
    feature: { osmMeta },
  } = useFeatureContext();

  const { timestamp = '2001-00-00', type, user, version = '?' } = osmMeta;
  const { itemUrl, historyUrl, changesetUrl, userUrl } = getUrls(osmMeta);
  const date = timestamp?.split('T')[0];

  return (
    <Typography variant="caption">
      <A href={itemUrl}>{capitalize(type)}</A> •{' '}
      <A href={historyUrl}>version {version}</A> •{' '}
      <A href={changesetUrl}>{date}</A> • <A href={userUrl}>{user || 'n/a'}</A>
    </Typography>
  );
};

const FromOsm = () => (
  <>
    <Stack direction="row" alignItems="flex-start" gap={2}>
      <Typography variant="body2">
        <Translation id="homepage.about_osm" />
      </Typography>
      <img
        src="/logo-osm.svg"
        alt="OpenStreetMap logo"
        width={50}
        height={50}
      />
    </Stack>
    <Urls />
  </>
);

export const FeatureDescription = () => {
  const {
    feature: { osmMeta, nonOsmObject, point },
  } = useFeatureContext();
  const { type } = osmMeta;

  if (point) {
    return <div>{t('featurepanel.feature_description_point')}</div>;
  }
  if (nonOsmObject) {
    return <div>{t('featurepanel.feature_description_nonosm', { type })}</div>;
  }

  return <FromOsm />;
};
