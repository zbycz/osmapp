import { Day } from './parser/types';
import { isValid } from './parser/buildString';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { SetDaysAndTagFn } from './types';

type Props = {
  dayIdx: number;
  days: Day[];
  setDaysAndTag: SetDaysAndTagFn;
};

const getOnClick = (setDaysAndTag: SetDaysAndTagFn, dayIdx: number) => () => {
  setDaysAndTag((prev) => {
    const newDays = [...prev];
    newDays[dayIdx].timeSlots = cloneDeep(newDays[dayIdx - 1].timeSlots);
    return newDays;
  });
};

export const CopyFromAboveButton = ({ dayIdx, days, setDaysAndTag }: Props) => {
  if (dayIdx === 0) {
    return null;
  }

  const prevDay = days[dayIdx - 1];
  const thisDay = days[dayIdx];

  if (prevDay.timeSlots.length === 0 || !prevDay.timeSlots.every(isValid)) {
    return null;
  }

  if (
    thisDay.timeSlots.length > 0 ||
    JSON.stringify(prevDay.timeSlots) === JSON.stringify(thisDay.timeSlots)
  ) {
    return null;
  }

  const onClick = getOnClick(setDaysAndTag, dayIdx);

  return (
    <IconButton onClick={onClick}>
      <ContentCopyIcon sx={{ fontSize: '13px' }} />
    </IconButton>
  );
};
