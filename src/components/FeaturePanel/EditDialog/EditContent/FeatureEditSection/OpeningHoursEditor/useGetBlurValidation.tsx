import { Day, DaysTable } from './parser/types';
import { useRef } from 'react';
import { isValid } from './parser/buildString';

const validateAndPopEmptySlots = (prevDays: DaysTable) =>
  prevDays.map((day) => {
    const timeSlots = day.timeSlots.map((slot) => ({
      ...slot,
      error: !isValid(slot),
    }));

    for (let i = timeSlots.length - 1; i >= 0; i--) {
      if (timeSlots[i].from === '' && timeSlots[i].to === '') {
        timeSlots.pop();
      } else {
        break;
      }
    }

    return { ...day, timeSlots };
  });

export const useGetBlurValidation = (
  setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void,
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onBlur = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDays(validateAndPopEmptySlots);
    }, 1000);
  };

  const onFocus = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return { onBlur, onFocus };
};
