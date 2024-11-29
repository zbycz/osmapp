import { useLocationImage } from './useImage';
import { getGlobalMap } from '../../services/mapStorage';
import React from 'react';
import { useUpdateInstructions } from './useUpdateInstructions';
import { BottomPanel } from './BottomPanel';
import { TopPanel } from './TopPanel';
import { useUpdateMapView } from './useUpdateMapView';
import { useWakeLock } from './useWakeLock';

export const TurnByTurnNavigation = () => {
  const segment = useUpdateInstructions();
  useUpdateMapView(segment);
  useLocationImage(getGlobalMap());
  useWakeLock();

  return (
    <>
      <TopPanel />
      <BottomPanel />
    </>
  );
};
