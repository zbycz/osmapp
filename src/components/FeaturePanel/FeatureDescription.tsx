import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { capitalize } from '../helpers';
import { t, Translation } from '../../services/intl';
import { useFeatureContext } from '../utils/FeatureContext';
import { TooltipButton } from '../utils/TooltipButton';
import { Feature } from '../../services/types';
import { OSM_WEBSITE } from '../../services/osmApiConsts';

const InfoTooltipWrapper = styled.span`
  position: relative;
  top: -3px;
  left: -3px;

  svg {
    font-size: 17px;
  }
`;

const A = ({ href, children }) =>
  href ? (
    <a href={href} target="_blank" className="colorInherit">
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
    <>
      <A href={itemUrl}>{capitalize(type)}</A> •{' '}
      <A href={historyUrl}>version {version}</A> •{' '}
      <A href={changesetUrl}>{date}</A> • <A href={userUrl}>{user || 'n/a'}</A>
    </>
  );
};

const FromOsm = () => (
  <Box m={1}>
    <Grid
      component="div"
      container
      direction="row"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Grid item xs={3}>
        <Box mt={2}>
          <img
            src="/logo-osm.svg"
            alt="OpenStreetMap logo"
            width={50}
            height={50}
          />
        </Box>
      </Grid>
      <Grid item xs={9} md={7}>
        <Box my={1}>
          <Typography variant="body2">
            <Translation id="homepage.about_osm" />
          </Typography>
        </Box>
      </Grid>
    </Grid>
    <Urls />
  </Box>
);

export const FeatureDescription = ({ advanced, setAdvanced }) => {
  const {
    feature: { osmMeta, nonOsmObject, point },
  } = useFeatureContext();
  const { type } = osmMeta;

  const onClick = (e: React.MouseEvent) => {
    // Alt+Shift+click to enable FeaturePanel advanced mode
    if (e.shiftKey && e.altKey) {
      setAdvanced((v) => !v);
    }
  };

  if (point) {
    return <div>{t('featurepanel.feature_description_point')}</div>;
  }
  if (nonOsmObject) {
    return <div>{t('featurepanel.feature_description_nonosm', { type })}</div>;
  }

  return (
    <div>
      {advanced ? (
        <Urls />
      ) : (
        t('featurepanel.feature_description_osm', {
          type: capitalize(type),
        })
      )}
      <InfoTooltipWrapper>
        <TooltipButton
          tooltip={<FromOsm />}
          onClick={onClick}
          color="secondary"
        />
      </InfoTooltipWrapper>
    </div>
  );
};
