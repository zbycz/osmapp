import React, { createContext, useContext, useState } from 'react';
import { ClimbingTick, Setter } from '../../types';
import { EditTickModal } from '../FeaturePanel/Climbing/EditTickModal';
import { Tick, TickStyle } from '../FeaturePanel/Climbing/types';
import { onTickAdd } from '../../services/my-ticks/ticks';
import { Button } from '@mui/material';
import { useSnackbar } from './SnackbarContext';
import { useUserSettingsContext } from './userSettings/UserSettingsContext';
import {
  deleteClimbingTick,
  getClimbingTicks,
  postClimbingTick,
} from '../../services/my-ticks/myTicksApi';
import { useQuery, useQueryClient } from 'react-query';
import { PROJECT_ID } from '../../services/project';
import { useOsmAuthContext } from './OsmAuthContext';

export type TicksContextType = {
  editedTick: Tick | null;
  setEditedTick: Setter<Tick | null>;
  addTick: (shortId: string) => void;
  addTickToDb: (shortId: string) => Promise<void>;
  deleteTickFromDb: (tickId: number) => Promise<void>;
  data: ClimbingTick[] | null;
  error: unknown;
  isFetching: boolean;
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

  const { loggedIn } = useOsmAuthContext();
  const { data, error, isFetching } = useQuery({
    queryKey: ['climbing-ticks'],
    queryFn: getClimbingTicks,
    initialData: [],
    keepPreviousData: true,
    enabled: PROJECT_ID === 'openclimbing' && loggedIn,
  });

  const addTick = (shortId: string) => {
    const newTick = onTickAdd({ osmId: shortId, style });
    showToast(
      'Tick added!',
      'success',
      <EditTickButton onClick={() => setEditedTick(newTick)} />,
    );
  };

  const queryClient = useQueryClient();
  const addTickToDb = async (shortId: string) => {
    if (!shortId) return;
    const timestamp = new Date().toISOString();
    await postClimbingTick({ shortId, timestamp, style });
    await queryClient.invalidateQueries(['climbing-ticks']);
    showToast('Tick added to DB!', 'success');
  };

  const deleteTickFromDb = async (tickId: number) => {
    await deleteClimbingTick(tickId);
    await queryClient.invalidateQueries(['climbing-ticks']);
  };

  const value: TicksContextType = {
    editedTick,
    setEditedTick,
    addTick,
    addTickToDb,
    deleteTickFromDb,
    data,
    error,
    isFetching,
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
