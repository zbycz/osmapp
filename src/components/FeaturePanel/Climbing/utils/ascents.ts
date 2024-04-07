import { JSONValue } from '../types';

const KEY = 'ascents';

// @TODO generic util?
export const getLocalStorageItem = (key: string) => {
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
  window?.localStorage.setItem(key, JSON.stringify(value));
};

export const onAscentAdd = ({ osmId }) => {
  if (!osmId) return;
  const ascents = getLocalStorageItem(KEY);
  setLocalStorageItem(KEY, [
    ...ascents,
    { id: osmId, date: new Date().toISOString() },
  ]);
};

export const findAscents = (osmId: string) => {
  const ascents = getLocalStorageItem(KEY);
  return ascents?.filter((ascent) => osmId === ascent.id) ?? null;
};

export const onAscentDelete = ({
  osmId,
  index,
}: {
  osmId: string;
  index: number;
}) => {
  const ascents = getLocalStorageItem(KEY);

  const newArray = ascents.reduce(
    (acc, ascent) => {
      if (osmId === ascent.id) {
        const newIndex = acc.index + 1;
        if (acc.index === index) {
          return {
            ascents: acc.ascents,
            index: newIndex,
          };
        }
        return {
          ascents: [...acc.ascents, ascent],
          index: newIndex,
        };
      }

      return {
        ascents: [...acc.ascents, ascent],
        index: acc.index,
      };
    },
    { index: 0, ascents: [] },
  ).ascents;

  setLocalStorageItem(KEY, newArray);
};

export const isAscent = (osmId: string) => findAscents(osmId).length > 0;
