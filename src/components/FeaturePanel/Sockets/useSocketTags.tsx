import { useFeatureContext } from '../../utils/FeatureContext';
import pickBy from 'lodash/pickBy';
import mapKeys from 'lodash/mapKeys';
import groupBy from 'lodash/groupBy';
import { mapValues } from 'lodash';

export const useSocketTags = () => {
  const { feature } = useFeatureContext();
  const { tags } = feature;
  if (!tags) {
    return null;
  }

  const socketTags = mapKeys(
    pickBy(tags, (_, k) => k.startsWith('socket:')),
    (_, key) => key.replace(/^socket:/, ''),
  );
  const groupedEntries = groupBy(
    Object.entries(socketTags),
    ([key]) => key.split(':')[0],
  );
  const grouped = mapValues(groupedEntries, (value) =>
    Object.fromEntries(
      value.map(([key, value]) => {
        const [_, detail] = key.split(':', 2);
        return [detail ?? 'quantity', value];
      }),
    ),
  );

  return grouped;
};
