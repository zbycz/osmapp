import React from 'react';
import { RoutingResult } from '../Directions/routing/types';
import { Setter } from '../../types';
import { LonLat } from '../../services/types';

type Instruction = RoutingResult['instructions'][number];
export type InstructionWithPath = Instruction & { path: LonLat[] };

type TurnByTurnContextType = {
  routingResult: RoutingResult;
  setRoutingResult: Setter<RoutingResult>;
  instructions: InstructionWithPath[];
  setInstructions: Setter<InstructionWithPath[]>;
  initialInstructions: InstructionWithPath[];
  setInitialInstructions: Setter<InstructionWithPath[]>;
};

const TurnByTurnContext = React.createContext<TurnByTurnContextType>(null);

export const TurnByTurnProvider: React.FC = ({ children }) => {
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
