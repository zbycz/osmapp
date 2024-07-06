import { Button, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GetAppIcon from '@mui/icons-material/GetApp';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {
  PanelContent,
  PanelFooter,
  PanelScrollbars,
} from '../utils/PanelHelpers';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { LogoOpenClimbing } from '../../assets/LogoOpenClimbing';
import { PROJECT_DECRIPTION, PROJECT_NAME } from '../../services/project';
import { t, Translation } from '../../services/intl';
import { nl2br } from '../utils/nl2br';
import GithubIcon from '../../assets/GithubIcon';
import { SEARCH_BOX_HEIGHT } from '../SearchBox/consts';
import LogoOsmapp from '../../assets/LogoOsmapp';

export const Content = styled.div`
  height: calc(100% - ${SEARCH_BOX_HEIGHT}px);
  padding: 20px 2em 0 2em;

  a.maptiler {
    display: block;
    color: inherit;
    text-align: center;
    margin: 1em 0;

    strong {
      color: ${({ theme }) => theme.palette.primary.main};
      font-weight: normal;
    }

    &:hover {
      text-decoration: none;

      & strong {
        text-decoration: underline;
      }
    }
  }
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
    <Link href="/way/34633854">Empire State Building</Link> •{' '}
    <Link href="/way/119016167">
      {t('homepage.examples.charles_bridge_statues')}
    </Link>
  </>
);
const ExamplesClimbing = () => (
  <>
    <Link href="/relation/17262674">Prokopské údolí</Link> •{' '}
    <Link href="/relation/17130100">Roviště</Link> •{' '}
    <Link href="/relation/17089246">Lomy nad Velkou</Link>
  </>
);

export function Homepage({
  climbing,
  mobileMode,
  onClick,
}: {
  onClick: () => void;
  climbing: boolean;
  mobileMode: boolean;
}) {
  return (
    <PanelContent>
      <PanelScrollbars>
        <ClosePanelButton right onClick={onClick} />
        <Content>
          <div>
            <Center $mb>
              {climbing ? (
                <LogoOpenClimbing
                  width={100}
                  style={{
                    marginTop: 24,
                    marginBottom: 16,
                  }}
                />
              ) : (
                <StyledLogoOsmapp width={130} height={130} />
              )}
              <Typography
                variant="h4"
                component="h1"
                color="inherit"
                style={{ fontWeight: climbing ? 900 : undefined }}
              >
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
              {t('homepage.examples.eg')}{' '}
              {climbing ? <ExamplesClimbing /> : <Examples />}
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
                src={
                  climbing
                    ? '/openclimbing/openclimbing-screenshot-300px.png'
                    : '/osmapp/osmapp-screenshot-300px.png'
                }
                srcSet={
                  climbing
                    ? '/openclimbing/openclimbing-screenshot-300px@2x.png 2x'
                    : '/osmapp/osmapp-screenshot-300px@2x.png 2x'
                }
                alt={t('homepage.screenshot_alt')}
                width={300}
              />
            </Center>

            <Spacer />

            <Grid
              container
              direction="row"
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Grid item xs={4}>
                <img
                  src="/logo-osm.svg"
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

            <Translation id="homepage.special_thanks" />

            <Spacer />

            <a
              href="https://www.maptiler.com"
              rel="noopener"
              target="_blank"
              className="maptiler"
            >
              <img
                src="/maptiler.svg"
                alt="MapTiler logo"
                width={200}
                height={52}
              />
              <br />
              <Translation id="homepage.maptiler" />
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
          <PanelFooter />
        </Content>
      </PanelScrollbars>
    </PanelContent>
  );
}
