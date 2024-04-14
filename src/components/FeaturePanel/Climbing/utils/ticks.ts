import { JSONValue } from '../types';

const KEY = 'ticks';

// @TODO generic util?
export const getLocalStorageItem = (key: string) => {
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

// @TODO generic util?
export const setLocalStorageItem = (key: string, value: JSONValue) => {
  if (typeof window === 'undefined') return;
  window?.localStorage.setItem(key, JSON.stringify(value));
};

export const onTickAdd = ({ osmId }) => {
  if (!osmId) return;
  const ticks = getLocalStorageItem(KEY);
  setLocalStorageItem(KEY, [
    ...ticks,
    { id: osmId, date: new Date().toISOString() },
  ]);
};

export const findTicks = (osmId: string) => {
  const ticks = getLocalStorageItem(KEY);
  return ticks?.filter((tick) => osmId === tick.id) ?? null;
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
      if (osmId === tick.id) {
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
