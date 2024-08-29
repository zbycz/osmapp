import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import React from 'react';
import { Slot } from './parser/types';

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
  setTime: (
    dayIdx: number,
    slot: number,
    key: 'from' | 'to',
    value: string,
  ) => void;
};

export const TimeSlot = ({
  dayIdx,
  timeSlot,
  onBlur,
  onFocus,
  setTime,
}: Props) => {
  const { slot, from, to, error } = timeSlot;
  return (
    <Wrapper>
      <TimeInput
        value={from}
        onChange={(e) => setTime(dayIdx, slot, 'from', e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        error={error}
      />
      &nbsp;–&nbsp;
      <TimeInput
        value={to}
        onChange={(e) => setTime(dayIdx, slot, 'to', e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        error={error}
      />
    </Wrapper>
  );
};
