import { Button, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GetAppIcon from '@mui/icons-material/GetApp';
import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import {
  PanelContent,
  PanelFooterWrapper,
  PanelScrollbars,
} from '../utils/PanelHelpers';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import {
  PROJECT_DECRIPTION,
  PROJECT_ID,
  PROJECT_NAME,
} from '../../services/project';
import { intl, t, Translation } from '../../services/intl';
import { nl2br } from '../utils/nl2br';
import GithubIcon from '../../assets/GithubIcon';
import LogoOsmapp from '../../assets/LogoOsmapp';
import { LogoMaptiler } from '../../assets/LogoMaptiler';
import { HomepageOpenClimbing } from './HomepageOpenClimbing';

export const Content = styled.div`
  height: 100%;
  padding: 20px 1.5em 0 1.5em;
`;
const StyledLogoOsmapp = styled(LogoOsmapp)`
  width: 41%;
  height: auto;
  margin-top: 3em;
`;
const Center = styled.div<{ $mb?: boolean; $mb4?: boolean; $mt?: boolean }>`
  text-align: center;
  ${({ $mb }) => $mb && 'margin-bottom: 2em;'}
  ${({ $mb4 }) => $mb4 && 'margin-bottom: 4em;'}
  ${({ $mt }) => $mt && 'margin-top: 2em;'}
`;
const Spacer = styled.div`
  padding-bottom: 2em;
`;
const Examples = () => (
  <>
    {t('homepage.examples.eg')}{' '}
    <Link href="/way/34633854" locale={intl.lang}>
      Empire State Building
    </Link>{' '}
    •{' '}
    <Link href="/way/119016167" locale={intl.lang}>
      {t('homepage.examples.charles_bridge_statues')}
    </Link>
  </>
);

type Props = {
  onClick: () => void;
  mobileMode: boolean;
};

// This function doesn't contain any logic - so no extraction needed.
// eslint-disable-next-line max-lines-per-function
export const Homepage = ({ mobileMode, onClick }: Props) => {
  const isClimbing = PROJECT_ID === 'openclimbing';

  if (isClimbing) {
    return <HomepageOpenClimbing onClose={onClick} />;
  }

  return (
    <PanelContent>
      <PanelScrollbars>
        <ClosePanelButton right onClick={onClick} />
        <Content>
          <div>
            <Center $mb>
              <StyledLogoOsmapp width={130} height={130} />
              <Typography variant="h4" component="h1" color="inherit">
                {PROJECT_NAME}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {t(PROJECT_DECRIPTION)}
              </Typography>
            </Center>
            <Typography variant="body1" paragraph>
              {nl2br(t('homepage.how_to_start'))}
            </Typography>
            <Typography variant="body2" paragraph>
              <Examples />
            </Typography>
            {mobileMode && (
              <Center $mt $mb4>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={onClick}
                >
                  {t('homepage.go_to_map_button')}
                </Button>
              </Center>
            )}
            <Center $mb>
              <img
                src={'/osmapp/osmapp-screenshot-300px.png'}
                srcSet={'/osmapp/osmapp-screenshot-300px@2x.png 2x'}
                alt={t('homepage.screenshot_alt')}
                width={300}
              />
            </Center>
            <Spacer />
            <Stack direction="row" spacing={2}>
              <img
                src="/logo-osm.svg"
                alt="OpenStreetMap logo"
                width={100}
                height={100}
              />
              <div>
                <Typography variant="body2">
                  <Translation id="homepage.about_osm" />
                </Typography>
              </div>
            </Stack>
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
            <Typography variant="body2" paragraph>
              <GithubIcon
                width="32"
                height="32"
                style={{ verticalAlign: '-9px', margin: '0 10px 0 5px' }}
              />{' '}
              <Translation id="homepage.github_link" />
            </Typography>
            <Center $mb $mt>
              <Button
                variant="outlined"
                startIcon={<GetAppIcon />}
                color="primary"
                href="/install"
              >
                {t('install.button')}
              </Button>
            </Center>
            <Spacer />
            <Typography variant="overline" color="textSecondary" component="h2">
              {t('homepage.special_thanks_heading')}
            </Typography>
            <ul style={{ paddingLeft: '1.6em' }}>
              <li>
                <a href="https://www.openstreetmap.org/" target="_blank">
                  OpenStreetMap
                </a>
                {` – ${t('homepage.for_osm')}`}
              </li>
              <li>
                <a href="https://www.mapillary.com/" target="_blank">
                  Mapillary
                </a>
                {', '}
                <a href="https://kartaview.org/" target="_blank">
                  KartaView
                </a>
                {', '}
                <a href="https://www.panoramax.xyz/" target="_blank">
                  Panoramax
                </a>
                {', '}
                <a href="https://www.wikipedia.org/" target="_blank">
                  Wikipedia
                </a>
                {` – ${t('homepage.for_images')}`}
              </li>
              <li>
                <a href="https://www.maptiler.com" target="_blank">
                  Maptiler
                </a>
                {` – ${t('homepage.maptiler')}`}
              </li>
              <li>
                <a href="https://www.thunderforest.com/" target="_blank">
                  Thunderforest
                </a>
                {` – ${t('homepage.thunderforest')}`}
              </li>
              <li>
                <a href="https://www.graphhopper.com/" target="_blank">
                  GraphHopper
                </a>
                {` – ${t('homepage.graphhopper')}`}
              </li>
              <li>
                <a href="https://indoorequal.com/" target="_blank">
                  indoor=
                </a>
                {` – ${t('homepage.indoorequal')}`}
              </li>
            </ul>
            <a href="https://www.maptiler.com" target="_blank">
              <LogoMaptiler width={200} height={52} />
            </a>

            <Spacer />
            <Spacer />
            <Typography variant="overline" color="textSecondary" component="h2">
              {t('homepage.disclaimer_heading')}
            </Typography>
            <Translation id="homepage.disclaimer" />
            <br />
            <br />
            <Translation id="homepage.disclaimer_maptiler" />
            <Spacer />
          </div>
          <PanelFooterWrapper />
        </Content>
      </PanelScrollbars>
    </PanelContent>
  );
};
