import React from 'react';
import { Feature } from '../../../services/types';
import styled from '@emotion/styled';
import { Chip, Stack, Tooltip } from '@mui/material';
import { t } from '../../../services/intl';

const StyledChip = styled(Chip)`
  font-size: 10px;
  font-weight: 600;
  height: 14px;
  padding: 0;
  > span {
    padding: 4px;
  }
`;

type Props = {
  feature: Feature;
  hasTooltip?: boolean;
};

const climbingTypes = {
  boulder: {
    value: 'climbing:boulder',
    label: 'climbing_badges.type_boulder_label',
    description: 'climbing_badges.type_boulder_description',
  },
  trad: {
    value: 'climbing:trad',
    label: 'climbing_badges.type_trad_label',
    description: 'climbing_badges.type_trad_description',
  },
  speed: {
    value: 'climbing:speed',
    label: 'climbing_badges.type_speed_label',
    description: 'climbing_badges.type_speed_description',
  },
  sport: {
    value: 'climbing:sport',
    label: 'climbing_badges.type_sport_label',
    description: 'climbing_badges.type_sport_description',
  },
  multipitch: {
    value: 'climbing:multipitch',
    label: 'climbing_badges.type_multipitch_label',
    description: 'climbing_badges.type_multipitch_description',
  },
  ice: {
    value: 'climbing:ice',
    label: 'climbing_badges.type_ice_label',
    description: 'climbing_badges.type_ice_description',
  },
  mixed: {
    value: 'climbing:mixed',
    label: 'climbing_badges.type_mixed_label',
    description: 'climbing_badges.type_mixed_description',
  },
  deepwater: {
    value: 'climbing:deepwater',
    label: 'climbing_badges.type_deepwater_label',
    description: 'climbing_badges.type_deepwater_description',
  },
  toprope: {
    value: 'climbing:toprope',
    label: 'climbing_badges.type_toprope_label',
    description: 'climbing_badges.type_toprope_description',
  },
} as const;

const climbingHazards = {
  loose_rock: {
    value: 'climbing:hazard:loose_rock',
    label: 'climbing_badges.hazard_loose_rock_label',
    description: 'climbing_badges.hazard_loose_rock_description',
  },
  rockfall_zone: {
    value: 'climbing:hazard:rockfall_zone',
    label: 'climbing_badges.hazard_rockfall_zone_label',
    description: 'climbing_badges.hazard_rockfall_zone_description',
  },
  wet: {
    value: 'climbing:hazard:wet',
    label: 'climbing_badges.hazard_wet_label',
    description: 'climbing_badges.hazard_wet_description',
  },
  vegetation: {
    value: 'climbing:hazard:vegetation',
    label: 'climbing_badges.hazard_vegetation_label',
    description: 'climbing_badges.hazard_vegetation_description',
  },
  unstable_anchor: {
    value: 'climbing:hazard:unstable_anchor',
    label: 'climbing_badges.hazard_unstable_anchor_label',
    description: 'climbing_badges.hazard_unstable_anchor_description',
  },
  missing_anchor: {
    value: 'climbing:hazard:missing_anchor',
    label: 'climbing_badges.hazard_missing_anchor_label',
    description: 'climbing_badges.hazard_missing_anchor_description',
  },
  animal_nest: {
    value: 'climbing:hazard:animal_nest',
    label: 'climbing_badges.hazard_animal_nest_label',
    description: 'climbing_badges.hazard_animal_nest_description',
  },
  death_fall_zone: {
    value: 'climbing:hazard:death_fall_zone',
    label: 'climbing_badges.hazard_death_fall_zone_label',
    description: 'climbing_badges.hazard_death_fall_zone_description',
  },
  first_bolt_high: {
    value: 'climbing:hazard:first_bolt_high',
    label: 'climbing_badges.hazard_first_bolt_high_label',
    description: 'climbing_badges.hazard_first_bolt_high_description',
  },
  long_runout: {
    value: 'climbing:hazard:long_runout',
    label: 'climbing_badges.hazard_long_runout_label',
    description: 'climbing_badges.hazard_long_runout_description',
  },
  bad_protection: {
    value: 'climbing:hazard:bad_protection',
    label: 'climbing_badges.hazard_bad_protection_label',
    description: 'climbing_badges.hazard_bad_protection_description',
  },
  dirty_rock: {
    value: 'climbing:hazard:dirty_rock',
    label: 'climbing_badges.hazard_dirty_rock_label',
    description: 'climbing_badges.hazard_dirty_rock_description',
  },
} as const;

const renderTitle = (label, tagValue: string) => {
  return `${t(label)}${tagValue !== 'yes' ? ` (${tagValue})` : ''}`;
};

export const ClimbingBadges = ({ feature, hasTooltip }: Props) => {
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {Object.entries(climbingTypes).map(
        ([_key, { value, label, description }]) =>
          feature.tags?.[value] === 'yes' ? (
            <Tooltip key={value} title={hasTooltip ? t(description) : ''} arrow>
              <StyledChip
                label={t(label)}
                size="small"
                color="primary"
                variant="filled"
              />
            </Tooltip>
          ) : null,
      )}

      {Object.entries(climbingHazards).map(
        ([_key, { value, label, description }]) => {
          const tagValue = feature.tags?.[value];
          return tagValue !== 'no' && tagValue !== undefined ? (
            <Tooltip key={value} title={hasTooltip ? t(description) : ''} arrow>
              <StyledChip
                label={renderTitle(label, tagValue)}
                size="small"
                color="error"
              />
            </Tooltip>
          ) : null;
        },
      )}
    </Stack>
  );
};
