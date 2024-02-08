import React, { useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
  PanelFooter,
  PanelScrollbars,
  PanelWrapper,
} from '../utils/PanelHelpers';
import LogoOsmapp from '../../assets/LogoOsmapp';
import { useFeatureContext } from '../utils/FeatureContext';
import GithubIcon from '../../assets/GithubIcon';
import { nl2br } from '../utils/nl2br';
import { t, Translation } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';

export const Content = styled.div`
  height: calc(100vh - 72px); // 100% - TopPanel - FeatureImage
  padding: 20px 2em 0 2em;

  a.maptiler {
    display: block;
    color: inherit;
    text-align: center;
    margin: 1em 0;

    strong {
      color: ${({ theme }) => theme.palette.link};
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

const Center = styled.div`
  text-align: center;
  ${({ mb }) => mb && 'margin-bottom: 2em;'}
  ${({ mt }) => mt && 'margin-top: 2em;'}
`;

const Spacer = styled.div`
  padding-bottom: 2em;
`;

export const HomepagePanel = () => {
  const { feature, preview, homepageShown, hideHomepage, persistHideHomepage } =
    useFeatureContext();

  // hide after first shown feature or preview
  useEffect(() => {
    if (feature || preview) hideHomepage();
  }, [feature, preview]);

  if (!homepageShown) {
    return null;
  }

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ClosePanelButton right onClick={persistHideHomepage} />
        <Content>
          <div>
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

            <ul>
              <li>
                <Link href="/relation/17089246">
                  Lomy nad Velkou - Borová Věž
                </Link>
              </li>
              <li>
                <Link href="/relation/17089534">
                  Lomy nad Velkou - Šípkový lom
                </Link>
              </li>
              <li>
                <Link href="/relation/17092792">Roviště - Krutý Řím</Link>
              </li>
              <li>
                <Link href="/relation/17130318">Roviště - Monolit</Link>
              </li>
              <li>
                <Link href="/relation/17130100">Roviště - El Krakonoš</Link>
              </li>
              <li>
                <Link href="/relation/17087286">
                  Jickovice - Hlavní oblast - patro
                </Link>
              </li>
              <li>
                <Link href="/relation/17129043">Županovice</Link>
              </li>
            </ul>
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

            <Typography variant="body2" paragraph>
              <GithubIcon
                width="32"
                height="32"
                style={{ verticalAlign: '-9px', margin: '0 10px 0 5px' }}
              />{' '}
              <Translation id="homepage.github_link" />
            </Typography>

            <Center mb mt>
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
                src="/logo/maptiler.svg"
                alt="MapTiler logo"
                width={200}
                height={52}
              />
              <br />
              <Translation id="homepage.maptiler" />
            </a>

            <Spacer />
          </div>
          <PanelFooter />
        </Content>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
