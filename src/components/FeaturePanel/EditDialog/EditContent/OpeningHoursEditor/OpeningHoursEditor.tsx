import { useEditContext } from '../../EditContext';
import AccessTime from '@mui/icons-material/AccessTime';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { getDaysTable, getEmptyValue } from './parser/getDaysTable';
import { buildString } from './parser/buildString';
import { t } from '../../../../../services/intl';
import { Day, DaysTable } from './parser/types';
import { publishDbgObject } from '../../../../../utils';
import { canItHandle } from './parser/canItHandle';
import { OpeningHoursInput } from './OpeningHoursInput';
import { YoHoursLink } from './YoHoursLink';
import { AddSlotButton } from './AddSlotButton';
import { TimeSlot } from './TimeSlot';
import { CopyFromAboveButton } from './CopyFromAboveButton';
import { useGetBlurValidation } from './useGetBlurValidation';
import { SetDaysAndTagFn, SetDaysFn } from './types';

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

const useUpdateState = (days: Day[], setDays: SetDaysFn) => {
  const valueSetHere = useRef<string | undefined>(undefined);
  const { tags, setTag } = useEditContext().tags;

  const tag = tags.opening_hours ?? '';
  useEffect(() => {
    if (tag !== valueSetHere.current) {
      valueSetHere.current = tag;
      setDays(getDaysTable(tag));
    }
  }, [tag, setDays]);

  const setDaysAndTag: SetDaysAndTagFn = (transform) => {
    const newDays = transform(days);
    setDays(newDays);

    const built = buildString(newDays);
    setTag('opening_hours', built);
    valueSetHere.current = built;
  };

  return { setDaysAndTag };
};

// TODO Move useState, setStringValue and BlurValidation inside a context
const EditorTable = () => {
  const [days, setDays] = useState<DaysTable>(getEmptyValue());
  const { setDaysAndTag } = useUpdateState(days, setDays);

  const { onBlur, onFocus } = useGetBlurValidation(setDays);
  publishDbgObject('last daysTable', days);

  return (
    <Table>
      <tbody>
        {days.map(({ day, dayLabel, timeSlots }, dayIdx) => (
          <tr key={day}>
            <th>{dayLabel}</th>
            <td>
              {timeSlots.length === 0 && t('opening_hours.editor.closed')}

              {timeSlots.map((timeSlot) => (
                <TimeSlot
                  key={timeSlot.slotIdx}
                  dayIdx={dayIdx}
                  timeSlot={timeSlot}
                  setDaysAndTag={setDaysAndTag}
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
                dayIdx={dayIdx}
                days={days}
                setDaysAndTag={setDaysAndTag}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export const OpeningHoursEditor = () => {
  const { tags } = useEditContext().tags;

  if (tags.opening_hours && !canItHandle(tags.opening_hours)) {
    return <OpeningHoursInput cantEdit />;
  }

  return (
    <>
      <OpeningHoursInput />
      <Wrapper>
        <AccessTime fontSize="small" />
        <div>
          <EditorTable />
          <YoHoursLink />
        </div>
      </Wrapper>
    </>
  );
};
