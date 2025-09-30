import React from 'react';
import { AutocompleteSelect, Option } from './AutocompleteSelect';
import { useCurrentItem } from '../../context/EditContext';
import { t } from '../../../../../services/intl';
import { CLIMBING_ROCK_OPTIONS } from '../../../../../services/tagging/climbing/climbingRockData';
import { isClimbingRoute } from '../../../../../utils';
const KEY = 'climbing:rock';

export const ClimbingRockSelect = () => {
  const { tags } = useCurrentItem();
  const { setTag } = useCurrentItem();
  const isRoute = isClimbingRoute(tags);

  if (isRoute) return null;

  const options = CLIMBING_ROCK_OPTIONS.map((opt) => ({
    label: t(opt.translationKey),
    value: opt.value,
  }));

  const value = options.find((opt) => opt.value === tags[KEY]) ?? null;

  const onChange = (_e, option: Option | null) => {
    setTag(KEY, option?.value ?? '');
  };

  return (
    <AutocompleteSelect
      values={options}
      label={t('climbing_rock.label')}
      value={value}
      onChange={onChange}
      freeSolo
    />
  );
};
