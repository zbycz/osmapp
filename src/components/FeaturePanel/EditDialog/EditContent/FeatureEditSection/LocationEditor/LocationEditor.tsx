import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t } from '../../../../../../services/intl';

const EditFeatureMapDynamic = dynamic(() => import('./EditFeatureMap'), {
  ssr: false,
  loading: () => <div style={{ height: 500 }} />,
});

export const LocationEditor = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="button">{t('editdialog.location')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {expanded && <EditFeatureMapDynamic />}
      </AccordionDetails>
    </Accordion>
  );
};
