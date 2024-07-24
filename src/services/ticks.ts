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

export const getAllTicks = (): Array<Tick> => getLocalStorageItem(KEY);

export const onTickAdd = ({ osmId }) => {
  if (!osmId) return;
  const ticks = getAllTicks();
  setLocalStorageItem(KEY, [
    ...ticks,
    { osmId, date: new Date().toISOString(), style: null },
  ]);
};

export const getStorageIndex = (
  ticks: Array<Tick>,
  osmId: string,
  routeIndex: number,
): number | null => {
  const found = ticks?.reduce(
    (acc, tick, storageIndex) => {
      if (osmId === tick.osmId) {
        const newRouteIndex = acc.routeIndex + 1;
        return {
          storageIndex:
            newRouteIndex === routeIndex ? storageIndex : acc.storageIndex,
          routeIndex: newRouteIndex,
        };
      }
      return acc;
    },
    { routeIndex: -1, storageIndex: null },
  );
  return found.storageIndex;
};

export const findTicks = (osmId: string): Array<Tick> => {
  const ticks = getAllTicks();

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
  const ticks = getAllTicks();
  const storageIndex = getStorageIndex(ticks, osmId, index);
  const updatedArray = updateElementOnIndex<Tick>(
    ticks,
    storageIndex,
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
  const ticks = getAllTicks();

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
