import { Tick, TickStyle } from '../components/FeaturePanel/Climbing/types';
import {
  deleteFromArray,
  updateElementOnIndex,
} from '../components/FeaturePanel/Climbing/utils/array';
import { t } from './intl';

const KEY = 'ticks';
export const tickStyles: Array<{
  key: TickStyle;
  name: string;
  description?: string;
}> = [
  {
    key: null,
    name: 'Not selected',
    description: t('tick.style_description_not_selected'),
  },
  {
    key: 'OS',
    name: 'On sight',
    description: t('tick.style_description_OS'),
  },
  {
    key: 'FL',
    name: 'Flash',
    description: t('tick.style_description_FL'),
  },
  {
    key: 'RP',
    name: 'Red point',
    description: t('tick.style_description_RP'),
  },
  {
    key: 'PP',
    name: 'Pink point',
    description: t('tick.style_description_PP'),
  },
  {
    key: 'RK',
    name: 'Red cross',
    description: t('tick.style_description_RK'),
  },
  {
    key: 'AF',
    name: 'All free',
    description: t('tick.style_description_AF'),
  },
  {
    key: 'TR',
    name: 'Top rope',
    description: t('tick.style_description_TR'),
  },
  {
    key: 'FS',
    name: 'Free solo',
    description: t('tick.style_description_FS'),
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

export const onTickAdd = ({
  osmId,
  style,
}: {
  osmId: string;
  style: TickStyle;
}) => {
  if (!osmId) return;
  const ticks = getAllTicks();
  setLocalStorageItem(KEY, [
    ...ticks,
    { osmId, date: new Date().toISOString(), style },
  ]);
};

export const findTicks = (osmId: string): Array<Tick> => {
  const ticks = getAllTicks();

  return ticks?.filter((tick) => osmId === tick.osmId) ?? null;
};

export const getTickKey = (tick) => `${tick.osmId}-${tick.date}`;

const getTickIndexByKey = (ticks, key) =>
  ticks.findIndex((tick) => getTickKey(tick) === key);

export const onTickUpdate = ({
  tickKey,
  updatedObject,
}: {
  tickKey: string;
  updatedObject: Partial<Tick>;
}) => {
  const ticks = getAllTicks();
  const tickIndexToUpdate = getTickIndexByKey(ticks, tickKey);
  const updatedArray = updateElementOnIndex<Tick>(
    ticks,
    tickIndexToUpdate,
    (item) => ({ ...item, ...updatedObject }),
  );
  setLocalStorageItem(KEY, updatedArray);
};

export const onTickDelete = (tickKey: string) => {
  const ticks = getAllTicks();

  const tickIndexToDelete = getTickIndexByKey(ticks, tickKey);
  const newArray = deleteFromArray(ticks, tickIndexToDelete);
  setLocalStorageItem(KEY, newArray);
};

export const isTicked = (osmId: string) => findTicks(osmId).length > 0;
