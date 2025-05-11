import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useUserThemeContext } from '../../helpers/theme';
import { t } from '../../services/intl';

const AccordionStyle = {
  '&:before': {
    backgroundColor: 'transparent !important',
  },
};

// Dvojitý úder (“lub-dub”) + pauza, v 1s cyklu (což odpovídá cca 60 BPM).
const heartbeat = keyframes`
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.1);
  }
  10% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.1);
  }
  20% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

const Heart = styled.div`
  font-size: 32px;
  animation: ${heartbeat} 5s infinite;
`;

const Qr = styled.img<{ $isDark: boolean }>`
  ${({ $isDark }) => $isDark && `filter: invert(1);`}
`;

// This function doesn't contain any logic - so no extraction needed.
// eslint-disable-next-line max-lines-per-function
export const SupportUs = () => {
  const [isBitcoinDialogOpen, setIsBitcoinDialogOpen] = useState(false);
  const { currentTheme } = useUserThemeContext();
  const isDark = currentTheme === 'dark';

  const onClose = () => {
    setIsBitcoinDialogOpen(false);
  };

  return (
    <>
      <Box mt={5}>
        <Accordion disableGutters sx={AccordionStyle} elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Heart>❤️</Heart>
              <Typography variant="body1" paragraph>
                {t('support_us.title')}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" mb={2}>
              {t('support_us.p1')}
            </Typography>
            <Typography variant="body2" mt={2}>
              {t('support_us.p2')}
            </Typography>
            <Typography variant="body2" mt={2}>
              {t('support_us.how_to_help')}
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">{t('support_us.share')}</Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <a href="mailto:jvaclavik@gmail.com">
                    {t('support_us.feedback')}
                  </a>
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t('support_us.add_content')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t('support_us.develop')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t('support_us.contribute_financially')}
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body2">
                      <a onClick={() => setIsBitcoinDialogOpen(true)}>
                        Bitcoin
                      </a>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <a
                        href="https://github.com/sponsors/zbycz"
                        target="_blank"
                      >
                        Github sponsor
                      </a>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <a
                        href="https://buymeacoffee.com/openclimbing.org"
                        target="_blank"
                      >
                        Buy me a coffee
                      </a>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <a href="https://revolut.me/jvaclavik" target="_blank">
                        Revolut
                      </a>
                    </Typography>
                  </li>
                </ul>
              </li>
            </ul>
            {t('support_us.thanks')}
          </AccordionDetails>
        </Accordion>
      </Box>
      <Dialog open={isBitcoinDialogOpen} onClose={onClose}>
        <AppBar position="static" color="transparent">
          <Toolbar>
            <Typography noWrap variant="h6" component="div">
              {t('support_us.bitcoin_dialog_title')}
            </Typography>

            <Tooltip title="Close crag detail">
              <IconButton color="primary" edge="end" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <DialogContent dividers>
          <Qr src="/openclimbing/btcln.png" $isDark={isDark} />
          <Typography variant="body1">openclimbing@lnbits.cz</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};
