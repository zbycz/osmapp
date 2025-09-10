import React, { createContext, useContext, useState } from 'react';
import { Setter } from '../../../../types';
import { EditTickModal } from '../EditTickModal';
import { Tick, TickStyle } from '../types';
import { onTickAdd } from '../../../../services/my-ticks/ticks';
import { Button } from '@mui/material';
import { useSnackbar } from '../../../utils/SnackbarContext';

export type TicksContextType = {
  editedTick: Tick | null;
  setEditedTick: Setter<Tick | null>;
  onNewTickAdd: (shortOsmId: string, defaultClimbingStyle: string) => void;
};

export const TicksContext = createContext<TicksContextType>(undefined);

export const TicksProvider: React.FC = ({ children }) => {
  const [editedTick, setEditedTick] = useState<Tick | null>(null);
  const { showToast } = useSnackbar();

  const onNewTickAdd = (
    shortOsmId: string,
    defaultClimbingStyle: TickStyle,
  ) => {
    const newTick = onTickAdd({
      osmId: shortOsmId,
      style: defaultClimbingStyle,
    });
    showToast(
      'Tick added!',
      'success',
      <Button
        color="inherit"
        size="small"
        onClick={() => {
          setEditedTick(newTick);
        }}
      >
        Edit tick
      </Button>,
    );
  };

  const value: TicksContextType = {
    editedTick,
    setEditedTick,
    onNewTickAdd,
  };

  return (
    <TicksContext.Provider value={value}>
      {children}
      <EditTickModal
        tick={editedTick}
        isOpen={!!editedTick}
        onClose={() => {
          setEditedTick(null);
        }}
      />
    </TicksContext.Provider>
  );
};

export const useTicksContext = () => {
  const context = useContext(TicksContext);
  if (!context) {
    throw new Error('useTicksContext must be used within a TicksProvider');
  }
  return context;
};
