import { useEditContext } from '../../EditContext';
import { useFeatureContext } from '../../../../utils/FeatureContext';
import AccessTime from '@mui/icons-material/AccessTime';
import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getDaysTable } from './getDaysTable';
import { buildString, isValid } from './buildString';
import { t } from '../../../../../services/intl';
import { Day, DaysTable } from './common';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import cloneDeep from 'lodash/cloneDeep';
import { encodeUrl } from '../../../../../helpers/utils';

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
      setTag('opening_hours', buildString(newDays));
      return newDays;
    });
  };
};

const getAddTimeSlot =
  (setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void) =>
  (dayIdx: number) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIdx].timeSlots.push({
        from: '',
        to: '',
        slot: newDays[dayIdx].timeSlots.length,
      });
      return newDays;
    });
  };

const useGetCopyFromAbove = (
  setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void,
) => {
  const {
    tags: { setTag },
  } = useEditContext();

  return (dayIdx: number) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIdx].timeSlots = cloneDeep(newDays[dayIdx - 1].timeSlots);

      setTag('opening_hours', buildString(newDays));
      return newDays;
    });
  };
};

export const OpeningHoursEditor = () => {
  const {
    tags: { tags, setTag },
  } = useEditContext();
  const { feature } = useFeatureContext();

  const daysInit = getDaysTable(feature.tags.opening_hours ?? '');
  const [days, setDays] = useState<DaysTable>(daysInit);
  const { onBlur, onFocus } = useGetBlurValidation(setDays);

  const setTime = useGetSetTime(setDays);
  const addTimeSlot = getAddTimeSlot(setDays);
  const copyFromAbove = useGetCopyFromAbove(setDays);

  const builtInit = buildString(daysInit);
  const sanitized = feature.tags.opening_hours?.replace(/;([^ ])/g, '; $1');
  if (builtInit !== feature.tags.opening_hours && builtInit !== sanitized) {
    return (
      <Wrapper>
        <AccessTime fontSize="small" />
        <div>
          This opening hours is too complex for this editor. Please use the{' '}
          <a
            href={encodeUrl`https://projets.pavie.info/yohours/?oh=${tags['opening_hours']}`}
            title={tags['opening_hours']}
          >
            YoHours tool
          </a>
          .
          <br />
          <code>{feature.tags.opening_hours}</code>
        </div>
      </Wrapper>
    );
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
                  {timeSlots.length === 0 && t('opening_hours.today_closed')}
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

                  <IconButton
                    onClick={() => addTimeSlot(dayIdx)}
                    disabled={
                      !(
                        !timeSlots.length ||
                        isValid(timeSlots[timeSlots.length - 1])
                      )
                    }
                  >
                    <AddIcon sx={{ fontSize: '13px' }} />
                  </IconButton>

                  {dayIdx > 0 &&
                    days[dayIdx - 1].timeSlots.length > 0 &&
                    days[dayIdx - 1].timeSlots.every(isValid) &&
                    timeSlots.length === 0 &&
                    JSON.stringify(days[dayIdx - 1].timeSlots) !==
                      JSON.stringify(timeSlots) && (
                      <IconButton onClick={() => copyFromAbove(dayIdx)}>
                        <ContentCopyIcon sx={{ fontSize: '13px' }} />
                      </IconButton>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        Visualize this opening hours in{' '}
        <a
          href={encodeUrl`https://projets.pavie.info/yohours/?oh=${tags['opening_hours']}`}
          title={tags['opening_hours']}
        >
          YoHours tool
        </a>
        .
      </div>
    </Wrapper>
  );
};
