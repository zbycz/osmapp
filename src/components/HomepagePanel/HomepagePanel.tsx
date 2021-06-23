import React, { useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
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
`;

const StyledLogoOsmapp = styled(LogoOsmapp)`
  width: 41%;
  height: auto;
  margin-top: 3em;
`;

const Center = styled.div`
  text-align: center;
  margin-bottom: 2em;
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
            <Center>
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

            <Center>
              <Image
                src="/osmapp-screenshot.png"
                alt={t('homepage.screenshot_alt')}
                width={300}
                height={300 * (1033 / 1371)}
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
                <Image
                  src="/logo/logo-osm.svg"
                  alt={t('homepage.osm_logo_alt')}
                  width={100}
                  height={100}
                  priority
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

            <Spacer />

            <Typography variant="overline" color="textSecondary" component="h2">
              {t('homepage.special_thanks_heading')}
            </Typography>
            <Translation id="homepage.special_thanks" />
          </div>
          <PanelFooter />
        </Content>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
