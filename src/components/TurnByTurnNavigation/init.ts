import { Profile, RoutingResult } from '../Directions/routing/types';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { getSubPoints, pair, requestOrientationPermission } from './helpers';
import { getCurriedDistance } from '../SearchBox/utils';
import { getGlobalMap } from '../../services/mapStorage';
import { addToMap } from './addToMap';
import { useMapStateContext } from '../utils/MapStateContext';
import { MAX_DISTANCE } from './const';
import { useConfirmationContext } from '../utils/ConfirmationContext';
import { t } from '../../services/intl';

export const useInitTurnByTurnNav = (
  routingResult: RoutingResult,
  mode: Profile,
) => {
  const { setRoutingResult, setInitialInstructions, setInstructions, setMode } =
    useTurnByTurnContext();
  const { setMapClickDisabled } = useMapStateContext();
  const { confirm } = useConfirmationContext();

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
        const [firstPoint] = instructionsWithPaths[0].path;
        if (distanceToCurrentPos(firstPoint) > MAX_DISTANCE) {
          confirm({
            cancel: false,
            description: t('turn_by_turn.too_far'),
          });
          setMapClickDisabled(false);
          return;
        }

        const totalPath = instructionsWithPaths.flatMap(({ path }) => path);

        setRoutingResult(routingResult);
        setInstructions(instructionsWithPaths);
        setInitialInstructions(instructionsWithPaths);
        setMode(mode);

        addToMap(map, [], totalPath);
      },
      () => {
        setMapClickDisabled(false);
      },
    );
  };
};
