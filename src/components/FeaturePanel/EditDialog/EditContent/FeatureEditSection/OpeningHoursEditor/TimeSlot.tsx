import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import React from 'react';
import { Day, Slot } from './parser/types';
import { isValid } from './parser/buildString';
import { Setter } from '../../../../../../types';

const Wrapper = styled.span`
  white-space: nowrap;
  padding-right: 1em;

  &:last-of-type {
    padding-right: 0;
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

type Props = {
  dayIdx: number;
  timeSlot: Slot;
  onFocus: (e) => void;
  onBlur: (e) => void;
  setDaysAndTag: Setter<Day[]>;
};

export const TimeSlot = ({
  dayIdx,
  timeSlot,
  onBlur,
  onFocus,
  setDaysAndTag,
}: Props) => {
  const { slotIdx, from, to, error } = timeSlot;

  const setTime = (which: 'from' | 'to', value: string) => {
    setDaysAndTag((prev) => {
      const newDays = [...prev];
      const slot = newDays[dayIdx].timeSlots[slotIdx];
      slot[which] = value;
      if (slot.error) {
        slot.error = !isValid(slot); // if error, revalidate instantly
      }
      return newDays;
    });
  };

  return (
    <Wrapper>
      <TimeInput
        value={from}
        onChange={(e) => setTime('from', e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        error={error}
      />
      &nbsp;–&nbsp;
      <TimeInput
        value={to}
        onChange={(e) => setTime('to', e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        error={error}
      />
    </Wrapper>
  );
};
