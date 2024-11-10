import { zip } from 'lodash';
import { RoutingResult } from '../Directions/routing/types';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { getSubPoints } from './helpers';
import { LonLat } from '../../services/types';
import { findIndexByLowest } from '../../utils';
import { getDistance } from '../SearchBox/utils';

export const useInitTurnByTurnNav = (routingResult: RoutingResult) => {
  const { setRoutingResult, setInstructions } = useTurnByTurnContext();

  return () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { geojson } = routingResult;
      if (geojson.type !== 'LineString') {
        return;
      }

      const currentPos: LonLat = [coords.longitude, coords.latitude];

      // TODO: Replace with pythagorm theorem for performance reasons
      const distanceToCurrentPos = (point: LonLat) =>
        getDistance(point, currentPos);

      const paired = zip(
        geojson.coordinates,
        geojson.coordinates.slice(1),
      ).slice(0, -1);

      const pathParts = paired.map((pair) => getSubPoints(pair, 10));

      const instructionsWithPaths = routingResult.instructions.map(
        (instruction) => ({
          ...instruction,
          path: pathParts
            .slice(instruction.interval[0], instruction.interval[1])
            .flat(),
        }),
      );
      const index = findIndexByLowest(instructionsWithPaths, ({ path }) =>
        Math.min(...path.map(distanceToCurrentPos)),
      );
      const instructionsFromUserPos = [
        {
          ...instructionsWithPaths[index],
          path: instructionsWithPaths[index].path.slice(
            findIndexByLowest(
              instructionsWithPaths[index].path,
              distanceToCurrentPos,
            ),
          ),
        },
        ...instructionsWithPaths.slice(index + 1),
      ];
      const [firstPoint] = instructionsFromUserPos[0].path;
      if (distanceToCurrentPos(firstPoint) > 75) {
        throw new Error('please be near the route to start navigation');
      }

      setRoutingResult(routingResult);
      setInstructions(instructionsFromUserPos);
    });
  };
};
