import { useEditContext } from '../../EditContext';
import AccessTime from '@mui/icons-material/AccessTime';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { getDaysTable, getEmptyValue } from './parser/getDaysTable';
import { buildString, isValid } from './parser/buildString';
import { t } from '../../../../../services/intl';
import { Day, DaysTable, Slot } from './parser/types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import cloneDeep from 'lodash/cloneDeep';
import { publishDbgObject } from '../../../../../utils';
import { canEditorHandle } from './parser/utils';
import { OpeningHoursInput } from './OpeningHoursInput';
import { YoHoursLink } from './YoHoursLink';
import { AddSlotButton } from './AddSlotButton';
import { TimeSlot } from './TimeSlot';

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  margin-bottom: 1em;

  & > svg {
    margin: 0.6em 1em 0 0.3em;
  }
`;

const Table = styled.table`
  th {
    width: 90px;
    max-width: 90px;
    text-align: left;
    font-weight: normal;
    vertical-align: top;
    padding-top: 0.5em;
  }
  td {
    line-height: 2.5em;
  }
`;

const useGetBlurValidation = (
  setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void,
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onBlur = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log('validate');
      setDays((prevDays) =>
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
        }),
      );
    }, 1000);
  };
  const onFocus = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  return { onBlur, onFocus };
};

const useGetSetTime = (
  setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void,
  setStringValue: (value: string) => void,
) => {
  const {
    tags: { setTag },
  } = useEditContext();

  return (
    dayIdx: number,
    slotIdx: number,
    key: 'from' | 'to',
    value: string,
  ) => {
    setDays((prev) => {
      const newDays = [...prev];
      const slot = newDays[dayIdx].timeSlots[slotIdx];
      slot[key] = value;
      if (slot.error) {
        slot.error = !isValid(slot);
      }

      setStringValue(buildString(newDays));
      return newDays;
    });
  };
};

const useGetCopyFromAbove = (
  setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void,
  setStringValue: (value: string) => void,
) => {
  const {
    tags: { setTag },
  } = useEditContext();

  return (dayIdx: number) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIdx].timeSlots = cloneDeep(newDays[dayIdx - 1].timeSlots);

      setStringValue(buildString(newDays));
      return newDays;
    });
  };
};

const useUpdateState = (
  setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void,
) => {
  const valueSetHere = useRef<string | undefined>(undefined);
  const {
    tags: { tags, setTag },
  } = useEditContext();

  const setStringValue = (value: string) => {
    setTag('opening_hours', value);
    valueSetHere.current = value;
  };

  useEffect(() => {
    if (!tags.opening_hours || tags.opening_hours !== valueSetHere.current) {
      valueSetHere.current = tags.opening_hours;
      setDays(getDaysTable(tags.opening_hours));
    }
  }, [tags.opening_hours, setDays]);

  return { setStringValue };
};

type Props = {
  prevDay: Day | null;
  timeSlots: Slot[];
  onClick: () => void;
};

const CopyFromAboveButton = ({ prevDay, onClick, timeSlots }: Props) => {
  if (!prevDay?.timeSlots || !prevDay.timeSlots.every(isValid)) {
    return null;
  }

  if (
    timeSlots.length > 0 ||
    JSON.stringify(prevDay.timeSlots) === JSON.stringify(timeSlots)
  ) {
    return null;
  }

  return (
    <IconButton onClick={onClick}>
      <ContentCopyIcon sx={{ fontSize: '13px' }} />
    </IconButton>
  );
};

export const OpeningHoursEditor = () => {
  const {
    tags: { tags, setTag },
  } = useEditContext();

  const [days, setDays] = useState<DaysTable>(getEmptyValue());
  const { setStringValue } = useUpdateState(setDays);

  const { onBlur, onFocus } = useGetBlurValidation(setDays);

  const setTime = useGetSetTime(setDays, setStringValue);
  const copyFromAbove = useGetCopyFromAbove(setDays, setStringValue);

  publishDbgObject('last daysTable', days);

  if (tags.opening_hours && !canEditorHandle(tags.opening_hours)) {
    return <OpeningHoursInput cantEdit />;
  }

  return (
    <>
      <OpeningHoursInput />
      <Wrapper>
        <AccessTime fontSize="small" />
        <div>
          <Table>
            <tbody>
              {days.map(({ day, dayLabel, timeSlots }, dayIdx) => (
                <tr key={day}>
                  <th>{dayLabel}</th>
                  <td>
                    {timeSlots.length === 0 && t('opening_hours.editor.closed')}

                    {timeSlots.map((timeSlot) => (
                      <TimeSlot
                        key={timeSlot.slot}
                        dayIdx={dayIdx}
                        timeSlot={timeSlot}
                        setTime={setTime}
                        onBlur={onBlur}
                        onFocus={onFocus}
                      />
                    ))}

                    <AddSlotButton
                      dayIdx={dayIdx}
                      timeSlots={timeSlots}
                      setDays={setDays}
                    />

                    <CopyFromAboveButton
                      prevDay={dayIdx > 0 ? days[dayIdx - 1] : null}
                      timeSlots={timeSlots}
                      onClick={() => copyFromAbove(dayIdx)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <YoHoursLink />
        </div>
      </Wrapper>
    </>
  );
};
