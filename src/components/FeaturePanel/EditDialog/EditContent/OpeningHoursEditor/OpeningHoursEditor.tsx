import { useEditContext } from '../../EditContext';
import { useFeatureContext } from '../../../../utils/FeatureContext';
import AccessTime from '@mui/icons-material/AccessTime';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IconButton, TextField } from '@mui/material';
import { getDaysTable, INIT } from './parser/getDaysTable';
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

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  margin: 1em 0;

  & > svg {
    margin: 0.6em 1em 0 0;
  }
`;

const TimeSlot = styled.span`
  white-space: nowrap;
  padding-right: 1em;

  &:last-of-type {
    padding-right: 0;
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

type TimeInputProps = {
  value: string;
  onChange: (e) => void;
  onBlur: (e) => void;
  onFocus: (e) => void;
  error?: boolean;
};
const TimeInput = (props: TimeInputProps) => (
  <TextField
    value={props.value}
    variant="outlined"
    margin="none"
    size="small"
    onChange={props.onChange}
    onBlur={props.onBlur}
    onFocus={props.onFocus}
    sx={{ width: '70px' }}
    error={props.error}
  />
);

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

  const [days, setDays] = useState<DaysTable>(INIT);
  const { setStringValue } = useUpdateState(setDays);

  const { onBlur, onFocus } = useGetBlurValidation(setDays);

  const setTime = useGetSetTime(setDays, setStringValue);
  const copyFromAbove = useGetCopyFromAbove(setDays, setStringValue);

  publishDbgObject('last daysTable', days);

  if (tags.opening_hours && !canEditorHandle(tags.opening_hours)) {
    return <OpeningHoursInput />;
  }

  return (
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
                  {timeSlots.map(({ slot, from, to, error }) => (
                    <TimeSlot key={slot}>
                      <TimeInput
                        value={from}
                        onChange={(e) =>
                          setTime(dayIdx, slot, 'from', e.target.value)
                        }
                        onBlur={onBlur}
                        onFocus={onFocus}
                        error={error}
                      />
                      &nbsp;–&nbsp;
                      <TimeInput
                        value={to}
                        onChange={(e) =>
                          setTime(dayIdx, slot, 'to', e.target.value)
                        }
                        onBlur={onBlur}
                        onFocus={onFocus}
                        error={error}
                      />
                    </TimeSlot>
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
  );
};
