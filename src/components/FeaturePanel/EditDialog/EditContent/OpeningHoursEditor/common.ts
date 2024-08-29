import { t } from '../../../../../services/intl';

export const OSM_DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
export const WEEK_DAYS = t('opening_hours.days_su_mo_tu_we_th_fr_sa').split(
  '|',
);

export type Slot = {
  slot: number;
  from: string;
  to: string;
  error?: boolean;
};
export type Day = {
  day: string;
  dayLabel: string;
  timeSlots: Slot[];
};
export type DaysTable = Day[];
