import { useTurnByTurnContext } from '../utils/TurnByTurnContext';

export const useEndTurnByTurn = () => {
  const { setRoutingResult, setInitialInstructions, setInstructions } =
    useTurnByTurnContext();

  return () => {
    setRoutingResult(null);
    setInstructions(null);
    setInitialInstructions(null);
  };
};
