import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import LogoOsmapp from '../../assets/LogoOsmapp';
import { nl2br } from '../utils/nl2br';
import { t, Translation } from '../../services/intl';

const StyledLogoOsmapp = styled(LogoOsmapp)`
  width: 41%;
  height: auto;
  margin-top: 3em;
`;

// @TODO unify primitive components
const Center = styled.div`
  text-align: center;
  ${({ mb }) => mb && 'margin-bottom: 2em;'}
  ${({ mt }) => mt && 'margin-top: 2em;'}
`;

const Spacer = styled.div`
  padding-bottom: 2em;
`;

export const OsmAppContent = () => (
  <>
    <Center mb>
      <StyledLogoOsmapp width={130} height={130} />
      <Typography variant="h4" component="h1" color="inherit">
        OsmAPP
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {t('homepage.subtitle')}
      </Typography>
    </Center>

    <Typography variant="body1" paragraph>
      {nl2br(t('homepage.how_to_start'))}
    </Typography>

    <Typography variant="body2" paragraph>
      {t('homepage.examples.eg')}{' '}
      <Link href="/way/34633854">Empire State Building</Link> •{' '}
      <Link href="/way/119016167">
        {t('homepage.examples.charles_bridge_statues')}
      </Link>
    </Typography>

    <Center mb>
      <img
        src="/osmapp-screenshot-300px.png"
        srcSet="/osmapp-screenshot-300px@2x.png 2x"
        alt={t('homepage.screenshot_alt')}
        width={300}
        height={226}
      />
    </Center>

    <Spacer />

    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={4}>
        <img
          src="/logo/logo-osm.svg"
          alt="OpenStreetMap logo"
          width={100}
          height={100}
        />
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" paragraph>
          <Translation id="homepage.about_osm" />
        </Typography>
      </Grid>
    </Grid>

    <Spacer />

    <Typography
      variant="overline"
      display="block"
      color="textSecondary"
      component="h2"
    >
      {t('homepage.heading_about_osmapp')}
    </Typography>

    <Typography variant="body2" paragraph>
      <Translation id="homepage.about_osmapp" />
    </Typography>
  </>
);
