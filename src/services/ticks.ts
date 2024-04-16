import { Tick, TickStyle } from '../components/FeaturePanel/Climbing/types';
import { updateElementOnIndex } from '../components/FeaturePanel/Climbing/utils/array';

const KEY = 'ticks';

export const tickStyles: Array<{
  key: TickStyle;
  name: string;
  description?: string;
}> = [
  {
    key: null,
    name: 'Not selected',
  },
  {
    key: 'OS',
    name: 'On sight',
  },
  {
    key: 'FL',
    name: 'Flash',
  },
  {
    key: 'RP',
    name: 'Red point',
  },
  {
    key: 'PP',
    name: 'Pink point',
  },
  {
    key: 'RK',
    name: 'Red cross',
  },
  {
    key: 'AF',
    name: 'All free',
  },
  {
    key: 'TR',
    name: 'Top rope',
  },
  {
    key: 'FS',
    name: 'Free solo',
  },
];

export const getLocalStorageItem = (key: string): Array<Tick> => {
  if (typeof window === 'undefined') return [];
  const raw = window?.localStorage.getItem(key);
  if (raw) {
    try {
      const json = JSON.parse(raw);

      return json;
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const setLocalStorageItem = (key: string, value: Array<Tick>) => {
  if (typeof window === 'undefined') return;
  window?.localStorage.setItem(key, JSON.stringify(value));
};

export const onTickAdd = ({ osmId }) => {
  if (!osmId) return;
  const ticks = getLocalStorageItem(KEY);
  setLocalStorageItem(KEY, [
    ...ticks,
    { osmId, date: new Date().toISOString(), style: null },
  ]);
};

export const findTicks = (osmId: string): Array<Tick> => {
  const ticks = getLocalStorageItem(KEY);

  return ticks?.filter((tick) => osmId === tick.osmId) ?? null;
};

export const onTickUpdate = ({
  osmId,
  index,
  updatedObject,
}: {
  osmId: string;
  index: number;
  updatedObject: Partial<Tick>;
}) => {
  const routeTicks = findTicks(osmId);
  const updatedArray = updateElementOnIndex<Tick>(
    routeTicks,
    index,
    (item) => ({ ...item, ...updatedObject }),
  );
  setLocalStorageItem(KEY, updatedArray);
};

export const onTickDelete = ({
  osmId,
  index,
}: {
  osmId: string;
  index: number;
}) => {
  const ticks = getLocalStorageItem(KEY);

  const newArray = ticks.reduce(
    (acc, tick) => {
      if (osmId === tick.osmId) {
        const newIndex = acc.index + 1;
        if (acc.index === index) {
          return {
            ticks: acc.ticks,
            index: newIndex,
          };
        }
        return {
          ticks: [...acc.ticks, tick],
          index: newIndex,
        };
      }

      return {
        ticks: [...acc.ticks, tick],
        index: acc.index,
      };
    },
    { index: 0, ticks: [] },
  ).ticks;

  setLocalStorageItem(KEY, newArray);
};

export const isTicked = (osmId: string) => findTicks(osmId).length > 0;
