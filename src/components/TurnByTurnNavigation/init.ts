import { zip } from 'lodash';
import { RoutingResult } from '../Directions/routing/types';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { getSubPoints, requestOrientationPermission } from './helpers';
import { LonLat } from '../../services/types';
import { findIndexByLowest } from '../../utils';
import { getDistance } from '../SearchBox/utils';
import { getSource } from './layer';
import { getGlobalMap } from '../../services/mapStorage';

export const useInitTurnByTurnNav = (routingResult: RoutingResult) => {
  const { setRoutingResult, setInstructions } = useTurnByTurnContext();

  return () => {
    requestOrientationPermission();
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { geojson } = routingResult;
      const map = getGlobalMap();
      if (geojson.type !== 'LineString' || !map) {
        return;
      }

      const currentPos: LonLat = [coords.longitude, coords.latitude];

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

      const totalPath = instructionsFromUserPos.flatMap(({ path }) => path);

      setRoutingResult(routingResult);
      setInstructions(instructionsFromUserPos);

      getSource(map).setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: totalPath,
            },
            properties: { status: 'uncompleted' },
          },
        ],
      });
    });
  };
};
