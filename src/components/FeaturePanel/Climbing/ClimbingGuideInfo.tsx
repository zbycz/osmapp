import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useFeatureContext } from '../../utils/FeatureContext';
import { t } from '../../../services/intl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LogoOpenClimbing } from '../../../assets/LogoOpenClimbing';

export const ClimbingGuideInfo = () => {
  const { persistShowHomepage } = useFeatureContext();
  const theme = useTheme();

  const handleClick = () => {
    persistShowHomepage();
  };

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      sx={{
        borderBottom: `solid 1px ${theme.palette.divider}`,
        marginBottom: 2,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
        <Stack direction="row" alignItems="center" gap={1}>
          <LogoOpenClimbing width={24} />
          <Typography color="secondary" variant="caption">
            <strong>openclimbing.org:</strong> {t('climbing.guideinfo.title')}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
          {t('climbing.guideinfo.description')}
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          mt={1}
        >
          <Button
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIosIcon />}
            sx={{ alignSelf: 'flex-end' }}
            onClick={handleClick}
          >
            {t('climbing.guideinfo.button')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
