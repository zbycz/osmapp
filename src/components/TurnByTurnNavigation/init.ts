import { Profile, RoutingResult } from '../Directions/routing/types';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { getSubPoints, pair, requestOrientationPermission } from './helpers';
import { findIndexByLowest } from '../../utils';
import { getCurriedDistance } from '../SearchBox/utils';
import { getGlobalMap } from '../../services/mapStorage';
import { addToMap } from './addToMap';
import { useMapStateContext } from '../utils/MapStateContext';

export const useInitTurnByTurnNav = (
  routingResult: RoutingResult,
  mode: Profile,
) => {
  const { setRoutingResult, setInitialInstructions, setInstructions, setMode } =
    useTurnByTurnContext();
  const { setMapClickDisabled } = useMapStateContext();

  return () => {
    requestOrientationPermission();
    setMapClickDisabled(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { geojson } = routingResult;
        const map = getGlobalMap();
        if (geojson.type !== 'LineString' || !map) {
          return;
        }

        const distanceToCurrentPos = getCurriedDistance([
          coords.longitude,
          coords.latitude,
        ]);

        const paired = pair(geojson.coordinates);
        const pathParts = paired.map((pair) => getSubPoints(pair, 5));

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

        const totalPath = instructionsFromUserPos.flatMap(({ path }) => path);

        setRoutingResult(routingResult);
        setInstructions(instructionsFromUserPos);
        setInitialInstructions(instructionsFromUserPos);
        setMode(mode);

        addToMap(map, [], totalPath);
      },
      () => {
        setMapClickDisabled(false);
      },
    );
  };
};
