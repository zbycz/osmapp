import React, { useState } from 'react';
import { Profile, RoutingResult } from '../Directions/routing/types';
import { Setter } from '../../types';
import { LonLat } from '../../services/types';
import { useMapStateContext } from './MapStateContext';

type Instruction = RoutingResult['instructions'][number];
export type InstructionWithPath = Instruction & { path: LonLat[] };

export type RotationMode = 'user' | 'route';

type TurnByTurnContextType = {
  routingResult: RoutingResult;
  setRoutingResult: Setter<RoutingResult>;
  instructions: InstructionWithPath[];
  setInstructions: Setter<InstructionWithPath[]>;
  initialInstructions: InstructionWithPath[];
  setInitialInstructions: Setter<InstructionWithPath[]>;
  mode: Profile;
  setMode: Setter<Profile>;
  end: () => void;
  rotationMode: RotationMode;
  setRotationMode: Setter<RotationMode>;
};

const TurnByTurnContext = React.createContext<TurnByTurnContextType>(null);

export const TurnByTurnProvider: React.FC = ({ children }) => {
  const { setMapClickDisabled } = useMapStateContext();

  const [routingResult, setRoutingResult] = React.useState<RoutingResult>(null);
  const [instructions, setInstructions] =
    React.useState<InstructionWithPath[]>(null);
  const [initialInstructions, setInitialInstructions] =
    React.useState<InstructionWithPath[]>(null);
  const [mode, setMode] = React.useState<Profile>(null);
  const [rotationMode, setRotationMode] = React.useState<RotationMode>('user');

  const value: TurnByTurnContextType = {
    routingResult,
    setRoutingResult,
    instructions,
    setInstructions,
    initialInstructions,
    setInitialInstructions,
    mode,
    setMode: (setter) => {
      const newValue = typeof setter === 'function' ? setter(mode) : setter;

      if (newValue === 'walk') {
        setRotationMode('user');
      } else {
        setRotationMode('route');
      }
    },
    end: () => {
      setRoutingResult(null);
      setInstructions(null);
      setInitialInstructions(null);
      setMapClickDisabled(false);
      setMode(null);
    },
    rotationMode,
    setRotationMode,
  };

  return (
    <TurnByTurnContext.Provider value={value}>
      {children}
    </TurnByTurnContext.Provider>
  );
};

export const useTurnByTurnContext = () => {
  return React.useContext(TurnByTurnContext);
};
