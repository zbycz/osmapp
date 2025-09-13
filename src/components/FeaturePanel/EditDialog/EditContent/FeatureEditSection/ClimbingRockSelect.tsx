import React from 'react';
import { AutocompleteSelect } from './AutocompleteSelect';
import { useCurrentItem } from '../../context/EditContext';
import { t } from '../../../../../services/intl';
import { CLIMBING_ROCK_OPTIONS } from '../../../../../services/tagging/climbing/climbingRockData';
import { isClimbingRoute } from '../../../../../utils';
const KEY = 'climbing:rock';

export const ClimbingRockSelect = () => {
  const { tags } = useCurrentItem();
  const value = tags[KEY] ?? '';
  const { setTag } = useCurrentItem();
  const isRoute = isClimbingRoute(tags);

  if (isRoute) return null;

  const onChange = (_e, option) => {
    setTag(KEY, option);
  };

  const translatedOptions = CLIMBING_ROCK_OPTIONS.map((opt) =>
    t(opt.translationKey),
  );

  return (
    <AutocompleteSelect
      values={translatedOptions}
      label={t('climbing_rock.label')}
      defaultValue={value}
      onChange={onChange}
      freeSolo
    />
  );
};
