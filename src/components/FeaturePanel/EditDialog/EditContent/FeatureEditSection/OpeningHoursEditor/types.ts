import { Day } from './parser/types';

export type SetDaysFn = (value: ((prevState: Day[]) => Day[]) | Day[]) => void;
export type SetDaysAndTagFn = (value: (prev: Day[]) => Day[]) => void;
