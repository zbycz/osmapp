import { useLocationImage } from './useImage';
import { getGlobalMap } from '../../services/mapStorage';
import React from 'react';
import { useUpdateInstructions } from './useUpdateInstructions';
import { BottomPanel } from './BottomPanel';
import { TopPanel } from './TopPanel';

export const TurnByTurnNavigation = () => {
  useUpdateInstructions();
  useLocationImage(getGlobalMap());

  return (
    <>
      <TopPanel />
      <BottomPanel />
    </>
  );
};
