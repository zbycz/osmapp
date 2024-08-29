import { Day, Slot } from './parser/types';
import { IconButton } from '@mui/material';
import { isValid } from './parser/buildString';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

type Props = {
  dayIdx: number;
  setDays: (value: ((prevState: Day[]) => Day[]) | Day[]) => void;
  timeSlots: Slot[];
};

export const AddSlotButton = ({ dayIdx, timeSlots, setDays }: Props) => {
  const onClick = () => {
    setDays((prev) => {
      const newDays = [...prev];

      newDays[dayIdx].timeSlots.push({
        from: '',
        to: '',
        slotIdx: newDays[dayIdx].timeSlots.length,
      });

      return newDays;
    });
  };

  return (
    <IconButton
      onClick={onClick}
      disabled={!!timeSlots.length && !isValid(timeSlots[timeSlots.length - 1])}
    >
      <AddIcon sx={{ fontSize: '13px' }} />
    </IconButton>
  );
};
