import React, { useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
  PanelFooter,
  PanelScrollbars,
  PanelWrapper,
} from '../utils/PanelHelpers';
import { useFeatureContext } from '../utils/FeatureContext';
import GithubIcon from '../../assets/GithubIcon';
import { t, Translation } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { OpenClimbingContent } from './OpenClimbingContent';
import { OsmAppContent } from './OsmAppContent';

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

// @TODO unify primitive components
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
  const isOpenClimbingDomain = true;
  // document.location.origin.includes('openclimbing.org');

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ClosePanelButton right onClick={persistHideHomepage} />
        <Content>
          <div>
            {isOpenClimbingDomain ? <OpenClimbingContent /> : <OsmAppContent />}

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
    </PanelWrapper>
  );
};
