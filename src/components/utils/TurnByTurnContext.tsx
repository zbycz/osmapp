import React, { useState } from 'react';
import { RoutingResult } from '../Directions/routing/types';
import { Setter } from '../../types';
import { LonLat } from '../../services/types';
import { useMapStateContext } from './MapStateContext';

type Instruction = RoutingResult['instructions'][number];
export type InstructionWithPath = Instruction & { path: LonLat[] };

type TurnByTurnContextType = {
  routingResult: RoutingResult;
  setRoutingResult: Setter<RoutingResult>;
  instructions: InstructionWithPath[];
  setInstructions: Setter<InstructionWithPath[]>;
  initialInstructions: InstructionWithPath[];
  setInitialInstructions: Setter<InstructionWithPath[]>;
  end: () => void;
};

const TurnByTurnContext = React.createContext<TurnByTurnContextType>(null);

export const TurnByTurnProvider: React.FC = ({ children }) => {
  const { setMapClickDisabled } = useMapStateContext();

  const [routingResult, setRoutingResult] = React.useState<RoutingResult>(null);
  const [instructions, setInstructions] =
    React.useState<InstructionWithPath[]>(null);
  const [initialInstructions, setInitialInstructions] =
    React.useState<InstructionWithPath[]>(null);

  const value: TurnByTurnContextType = {
    routingResult,
    setRoutingResult,
    instructions,
    setInstructions,
    initialInstructions,
    setInitialInstructions,
    end: () => {
      setRoutingResult(null);
      setInstructions(null);
      setInitialInstructions(null);
      setMapClickDisabled(false);
    },
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
