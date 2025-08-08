import { Stack } from '@mui/material';
import { MultiValueKeyEditor } from './MultiValueKeyEditor/MultiValueKeyEditor';
import React from 'react';

export const ClimbingMultiValues = () => (
  <Stack mt={3} gap={2}>
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
