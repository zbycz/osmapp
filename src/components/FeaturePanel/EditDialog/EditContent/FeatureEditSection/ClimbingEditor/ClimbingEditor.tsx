import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { MultiValueKeyEditor } from './MultiValueKeyEditor';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t } from '../../../../../../services/intl';
import { useCurrentItem } from '../../../EditContext';
import { Maki } from '../../../../../utils/icons/Maki';

const ClimbingMultiValuesInner = () => {
  return (
    <Stack gap={1} ml={1}>
      <MultiValueKeyEditor
        label={t('climbing_badges.type_label')}
        keys={[
          'climbing:boulder',
          'climbing:sport',
          'climbing:trad',
          'climbing:multipitch',
          'climbing:toprope',
          'climbing:speed',
          'climbing:ice',
          'climbing:mixed',
          'climbing:deepwater',
        ]}
      />
      <MultiValueKeyEditor
        label={t('climbing_badges.inclination_label')}
        keys={[
          'climbing:inclination:vertical',
          'climbing:inclination:slab',
          'climbing:inclination:overhang',
          'climbing:inclination:traverse',
          'climbing:inclination:roof',
        ]}
      />
      <MultiValueKeyEditor
        label={t('climbing_badges.hazard_label')}
        keys={[
          'climbing:hazard:loose_rock',
          'climbing:hazard:rockfall_zone',
          'climbing:hazard:wet',
          'climbing:hazard:vegetation',
          'climbing:hazard:unstable_anchor',
          'climbing:hazard:missing_anchor',
          'climbing:hazard:animal_nest',
          'climbing:hazard:death_fall_zone',
          'climbing:hazard:first_bolt_high',
          'climbing:hazard:long_runout',
          'climbing:hazard:bad_protection',
          'climbing:hazard:dirty_rock',
          'climbing:hazard:slippery_rock',
        ]}
        editableValues={[
          'climbing:hazard:first_bolt_high',
          'climbing:hazard:long_runout',
        ]}
      />
    </Stack>
  );
};

export const ClimbingEditor = () => {
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
