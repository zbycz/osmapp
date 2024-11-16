import React from 'react';
import { Pair, pair, unpair, useLocation } from './helpers';
import { findIndexByLowest } from '../../utils';
import {
  InstructionWithPath,
  useTurnByTurnContext,
} from '../utils/TurnByTurnContext';
import { getCurriedDistance } from '../SearchBox/utils';
import { addToMap, resetMapRoute } from './addToMap';
import { getGlobalMap } from '../../services/mapStorage';
import { sumBy } from 'lodash';
import { LonLat } from '../../services/types';

type InstructionState = 'completed' | 'uncompleted' | 'partial';

const calculateNearestIndex = (
  pairedPath: Pair<LonLat>[],
  distanceFromUser: (point: LonLat) => number,
) =>
  findIndexByLowest(
    pairedPath,
    ([p0, p1]) => distanceFromUser(p0) + distanceFromUser(p1),
  );

const splitPath = (pairs: Pair<LonLat>[], nearestIndex: number) => ({
  completedPath: unpair(pairs.slice(0, nearestIndex)),
  uncompletedPath: unpair(pairs.slice(nearestIndex)),
});

const groupInstructionsByState = (
  initialInstructions: InstructionWithPath[],
  nearestIndex: number,
) =>
  initialInstructions.reduce<Record<InstructionState, InstructionWithPath[]>>(
    (groups, instruction, index) => {
      const prevInstructions = initialInstructions.slice(0, index);
      const traversedPointsPathStart = sumBy(
        prevInstructions,
        ({ path }) => path.length,
      );
      const traversedPointsPathEnd =
        traversedPointsPathStart + instruction.path.length;

      const isPartial =
        nearestIndex >= traversedPointsPathStart &&
        nearestIndex < traversedPointsPathEnd;
      const isCompleted = nearestIndex >= traversedPointsPathEnd;

      const newInstruction = isPartial
        ? {
            ...instruction,
            path: instruction.path.slice(
              nearestIndex - traversedPointsPathStart,
            ),
          }
        : instruction;

      const key: InstructionState = isCompleted
        ? 'completed'
        : isPartial
          ? 'partial'
          : 'uncompleted';

      return {
        ...groups,
        [key]: [...groups[key], newInstruction],
      };
    },
    { completed: [], uncompleted: [], partial: [] },
  );

export const useUpdateInstructions = () => {
  const location = useLocation();
  const { initialInstructions, setInstructions } = useTurnByTurnContext();
  const [pathSegment, setPathSegment] = React.useState<Pair<LonLat>>(null);

  React.useEffect(() => {
    if (!location) {
      return;
    }
    const { latitude, longitude } = location.coords;

    const totalPath = initialInstructions.flatMap(({ path }) => path);
    const pairs = pair(totalPath);

    const nearestIndex = calculateNearestIndex(
      pairs,
      getCurriedDistance([longitude, latitude]),
    );

    setPathSegment(pairs[nearestIndex]);

    const { completedPath, uncompletedPath } = splitPath(pairs, nearestIndex);
    addToMap(getGlobalMap(), completedPath, uncompletedPath);

    const grouped = groupInstructionsByState(initialInstructions, nearestIndex);
    setInstructions([...grouped.partial, ...grouped.uncompleted]);

    return () => {
      resetMapRoute(getGlobalMap());
    };
  }, [location, initialInstructions, setInstructions]);

  return pathSegment;
};
