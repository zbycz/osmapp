import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { MultiValueKeyEditor } from './MultiValueKeyEditor/MultiValueKeyEditor';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t } from '../../../../../services/intl';
import { useCurrentItem } from '../../EditContext';
import { Maki } from '../../../../utils/icons/Maki';

const ClimbingMultiValuesInner = () => {
  return (
    <Stack gap={2}>
      <MultiValueKeyEditor
        translationKey="climbing_badges.type"
        baseKey="climbing"
        values={[
          'boulder',
          'sport',
          'trad',
          'multipitch',
          'toprope',
          'speed',
          'ice',
          'mixed',
          'deepwater',
        ]}
      />
      <MultiValueKeyEditor
        baseKey="climbing:inclination"
        translationKey="climbing_badges.inclination"
        values={['vertical', 'slab', 'overhang', 'traverse', 'roof']}
      />
      <MultiValueKeyEditor
        baseKey="climbing:hazard"
        translationKey="climbing_badges.hazard"
        values={[
          'loose_rock',
          'rockfall_zone',
          'wet',
          'vegetation',
          'unstable_anchor',
          'missing_anchor',
          'animal_nest',
          'death_fall_zone',
          'first_bolt_high',
          'long_runout',
          'bad_protection',
          'dirty_rock',
          'slippery_rock',
        ]}
        editableValues={['first_bolt_high', 'long_runout']}
      />
    </Stack>
  );
};

export const ClimbingMultiValues = () => {
  const { tags } = useCurrentItem();
  const [expanded, setExpanded] = useState(!!tags.climbing);
  if (!tags.climbing) {
    return null;
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Maki ico="climbing" size={16} themed />
          <Typography variant="button">
            {t('editdialog.climbing_editor')}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Box ml={2}>
          <ClimbingMultiValuesInner />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
