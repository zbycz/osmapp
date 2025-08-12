import {
  Button,
  Stack,
  Typography,
  Link as LinkMui,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';
import { PanelContent, PanelScrollbars } from '../utils/PanelHelpers';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { LogoOpenClimbing } from '../../assets/LogoOpenClimbing';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { intl, t, Translation } from '../../services/intl';
import GithubIcon from '../../assets/GithubIcon';
import { LogoMaptiler } from '../../assets/LogoMaptiler';
import { DividerOpenClimbing } from './DividerOpenClimbing';
import { useMobileMode } from '../helpers';
import { HomepageOpenClimbingGallery } from './HomepageOpenClimbingGallery';
import { SupportUs } from './SupportUs';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
const AccordionStyle = {
  '&:before': {
    backgroundColor: 'transparent !important',
  },
};

export const From = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  padding-bottom: 10px;
`;

export const Divider = styled.div`
  align-items: center;
  display: flex;
  margin: 0 -32px;
`;

export const Content = styled.div`
  height: 100%;
  padding: 20px 2em 0 2em;
`;

const Header = () => {
  const isMobileMode = useMobileMode();

  const iconWidth = isMobileMode ? 40 : 58;
  return (
    <Stack
      direction={isMobileMode ? 'row' : 'column'}
      alignItems="center"
      spacing={3}
      sx={{
        mt: isMobileMode ? 1 : 3,
        mb: isMobileMode ? 2 : 5,
      }}
    >
      <LogoOpenClimbing width={iconWidth} style={{ minWidth: iconWidth }} />
      <Stack component="section" direction="column-reverse">
        <Typography
          component="h1"
          variant="subtitle2"
          color="secondary"
          sx={{ textAlign: isMobileMode ? 'left' : 'center' }}
          textTransform="lowercase"
        >
          {t('project.openclimbing.climbing_guide')}
        </Typography>

        <Typography
          variant={isMobileMode ? 'h5' : 'h4'}
          fontFamily="Piazzolla"
          component="h2"
          color="inherit"
          fontWeight={900}
        >
          openclimbing.org
        </Typography>
      </Stack>
    </Stack>
  );
};

const Description = ({ isTextInfoExpanded, setIsTextInfoExpanded }) => (
  <>
    <Typography variant="body2" component="p" color="inherit">
      {t('homepage.openclimbing_description_p1')}{' '}
      <strong>
        {t('homepage.openclimbing_description_p2')}

        {!isTextInfoExpanded && (
          <>
            ..{' '}
            <LinkMui
              onClick={() => setIsTextInfoExpanded(true)}
              noWrap
              component="button"
            >
              ({t('homepage.description_show_more')})
            </LinkMui>
          </>
        )}
      </strong>
    </Typography>
    {isTextInfoExpanded && (
      <Typography variant="body2" component="p" color="inherit" mt={1}>
        {t('homepage.climbing.expanded_description_p1')}{' '}
        <Link href="https://wikipedia.org/wiki/OpenStreetMap" target="_blank">
          OpenStreetMap
        </Link>{' '}
        {t('homepage.climbing.expanded_description_p2')}{' '}
        <Link
          href="https://wikipedia.org/wiki/Wikimedia_Commons"
          target="_blank"
        >
          Wikimedia Commons
        </Link>
        {t('homepage.climbing.expanded_description_p3')}
      </Typography>
    )}
  </>
);

const STORY_URL = (lang) =>
  lang === 'cs'
    ? 'https://medium.com/@jvaclavik/p%C5%99%C3%ADb%C4%9Bh-za-openclimbing-org-e1e2b3de2024'
    : 'https://medium.com/@jvaclavik/story-behind-openclimbing-org-ab448939c6ac';

const Buttons = ({ onClose }) => (
  <>
    <Button
      variant="contained"
      color="primary"
      endIcon={<ChevronRightIcon />}
      onClick={onClose}
      fullWidth
      size="large"
      sx={{ mt: 4, mb: 2 }}
    >
      {t('homepage.go_to_map_button')}
    </Button>
    <Box mb={2}>
      <Stack spacing={1} direction="row">
        <Button
          variant="text"
          fullWidth
          href="https://medium.com/@jvaclavik/how-to-contribute-to-openclimbing-org-9a159ddd5d4c"
          target="_blank"
        >
          {t('homepage.add_new_climbing_area')}
        </Button>
        <Button
          variant="text"
          fullWidth
          href={STORY_URL(intl.lang)}
          target="_blank"
        >
          {t('homepage.our_story')}
        </Button>
      </Stack>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="text"
          href="https://community.openclimbing.org"
          target="_blank"
        >
          <QuestionAnswerIcon fontSize="inherit" sx={{ mr: 1 }} />
          {t('climbing.forum')}
        </Button>
      </Box>
    </Box>
  </>
);

const StyledGithubIcon = styled(GithubIcon)`
  filter: ${({ theme }) => theme.palette.invertFilter};
  margin: -2px 8px 0 0;
`;

const Banners = () => (
  <Stack
    spacing={1}
    direction={'row'}
    mt={6}
    sx={{ paddingBottom: 3 }}
    justifyContent="space-between"
  >
    <a
      href="https://www.maptiler.com"
      target="_blank"
      aria-label="MapTiler"
      title="MapTiler"
    >
      <LogoMaptiler width={140} />
    </a>
    <a
      href="https://vercel.com/?utm_source=osm-app-team&utm_campaign=oss"
      target="_blank"
    >
      <img src="/vercel.svg" alt="Vercel" width="160" />
    </a>
  </Stack>
);

const ImportantLinks = () => (
  <>
    <Typography variant="h6" component="h2" mt={4}>
      {t('homepage.important_links')}
    </Typography>
    <Accordion disableGutters elevation={0} sx={AccordionStyle}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <StyledGithubIcon width="32" />
          <Typography variant="body1" paragraph>
            {t('map.github_title')}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph>
          <Translation id="homepage.github_link" />
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion disableGutters elevation={0} sx={AccordionStyle}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <img src="/logo-osm.svg" alt="OpenStreetMap logo" width={32} />
          <Typography variant="body1" paragraph>
            OpenStreetMap
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph>
          <Translation id="homepage.about_osm" />
        </Typography>
      </AccordionDetails>
    </Accordion>
  </>
);

export function HomepageOpenClimbing({ onClose }: { onClose: () => void }) {
  const [isTextInfoExpanded, setIsTextInfoExpanded] = React.useState(false);

  return (
    <PanelContent>
      <PanelScrollbars>
        <ClosePanelButton right onClick={onClose} />
        <Content>
          <Stack height="100%">
            <Stack flex={1} justifyContent="center">
              <Header />
              <Description
                isTextInfoExpanded={isTextInfoExpanded}
                setIsTextInfoExpanded={setIsTextInfoExpanded}
              />
              <HomepageOpenClimbingGallery />
              <Buttons onClose={onClose} />
            </Stack>

            <Divider>
              <DividerOpenClimbing width="100%" />
            </Divider>

            <ImportantLinks />
            <SupportUs />
            <Banners />
            <From>
              <Typography variant="caption" color="secondary" letterSpacing={1}>
                Made in Prague with ♥
              </Typography>
            </From>
          </Stack>
        </Content>
      </PanelScrollbars>
    </PanelContent>
  );
}
