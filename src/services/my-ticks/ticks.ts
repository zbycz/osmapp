import {
  LocalStorageTick,
  TickStyle,
} from '../../components/FeaturePanel/Climbing/types';
import { t } from '../intl';

const KEY = 'ticks';
export const tickStyles: Array<{
  key: TickStyle;
  name: string;
  description?: string;
  color?: string;
}> = [
  {
    key: null,
    name: 'Not selected',
    description: t('tick.style_description_not_selected'),
    color: 'gray',
  },
  {
    key: 'OS',
    name: 'On sight',
    description: t('tick.style_description_OS'),
    color: 'red',
  },
  {
    key: 'FL',
    name: 'Flash',
    description: t('tick.style_description_FL'),
    color: 'green',
  },
  {
    key: 'RP',
    name: 'Red point',
    description: t('tick.style_description_RP'),
    color: 'red',
  },
  {
    key: 'PP',
    name: 'Pink point',
    description: t('tick.style_description_PP'),
    color: 'pink',
  },
  {
    key: 'RK',
    name: 'Red cross',
    description: t('tick.style_description_RK'),
    color: 'darkred',
  },
  {
    key: 'AF',
    name: 'All free',
    description: t('tick.style_description_AF'),
    color: 'lightgreen',
  },
  {
    key: 'TR',
    name: 'Top rope',
    description: t('tick.style_description_TR'),
    color: 'blue',
  },
  {
    key: 'FS',
    name: 'Free solo',
    description: t('tick.style_description_FS'),
    color: 'orange',
  },
];

const getLocalStorageItem = (key: string): Array<LocalStorageTick> => {
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

/** @deprecated load ticks from useTicksContext */
export const getAllTicks = (): Array<LocalStorageTick> =>
  getLocalStorageItem(KEY);
