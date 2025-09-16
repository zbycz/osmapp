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
  addTick: (shortId: string, style: TickStyle) => void;
};

const EditTickButton = (props: { onClick: () => void }) => (
  <Button color="inherit" size="small" onClick={props.onClick}>
    Edit tick
  </Button>
);

export const TicksContext = createContext<TicksContextType>(undefined);

export const TicksProvider: React.FC = ({ children }) => {
  const [editedTick, setEditedTick] = useState<Tick | null>(null);
  const { showToast } = useSnackbar();

  const addTick = (shortId: string, style: TickStyle) => {
    const newTick = onTickAdd({ osmId: shortId, style });
    showToast(
      'Tick added!',
      'success',
      <EditTickButton onClick={() => setEditedTick(newTick)} />,
    );
  };

  const value: TicksContextType = {
    editedTick,
    setEditedTick,
    addTick,
  };

  return (
    <TicksContext.Provider value={value}>
      {children}
      <EditTickModal
        tick={editedTick}
        isOpen={!!editedTick}
        onClose={() => setEditedTick(null)}
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
