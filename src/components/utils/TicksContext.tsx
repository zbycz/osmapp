import React, { createContext, useContext, useState } from 'react';
import { Setter } from '../../types';
import { EditTickModal } from '../FeaturePanel/Climbing/EditTickModal';
import { Tick, TickStyle } from '../FeaturePanel/Climbing/types';
import { onTickAdd } from '../../services/my-ticks/ticks';
import { Button } from '@mui/material';
import { useSnackbar } from './SnackbarContext';
import { useUserSettingsContext } from './userSettings/UserSettingsContext';
import { postClimbingTick } from '../../services/my-ticks/myTicksApi';

export type TicksContextType = {
  editedTick: Tick | null;
  setEditedTick: Setter<Tick | null>;
  addTick: (shortId: string) => void;
  addTickToDb: (shortId: string) => Promise<void>;
};

const EditTickButton = (props: { onClick: () => void }) => (
  <Button color="inherit" size="small" onClick={props.onClick}>
    Edit tick
  </Button>
);

const useGetDefaultTickStyle = (): TickStyle => {
  const { userSettings } = useUserSettingsContext();
  return userSettings['climbing.defaultClimbingStyle'] ?? 'OS';
};

export const TicksContext = createContext<TicksContextType>(undefined);

export const TicksProvider: React.FC = ({ children }) => {
  const [editedTick, setEditedTick] = useState<Tick | null>(null);
  const { showToast } = useSnackbar();
  const style = useGetDefaultTickStyle();

  const addTick = (shortId: string) => {
    const newTick = onTickAdd({ osmId: shortId, style });
    showToast(
      'Tick added!',
      'success',
      <EditTickButton onClick={() => setEditedTick(newTick)} />,
    );
  };

  const addTickToDb = async (shortId: string) => {
    if (!shortId) return;
    const timestamp = new Date().toISOString();
    await postClimbingTick({ shortId, timestamp, style });
    showToast('Tick added to DB!', 'success');
  };

  const value: TicksContextType = {
    editedTick,
    setEditedTick,
    addTick,
    addTickToDb,
  };

  return (
    <TicksContext.Provider value={value}>
      {children}
      <EditTickModal tick={editedTick} onClose={() => setEditedTick(null)} />
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
