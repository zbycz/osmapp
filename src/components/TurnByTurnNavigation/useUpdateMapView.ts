import { degToRadians } from '../../helpers/utils';
import { getGlobalMap } from '../../services/mapStorage';
import { LonLat } from '../../services/types';
import { Profile } from '../Directions/routing/types';
import { RotationMode, useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { Pair, useLocation, useOrientation } from './helpers';

type PathSegment = Pair<LonLat>;

const degPointToRadian = ([lon, lat]: LonLat) => [
  degToRadians(lon),
  degToRadians(lat),
];

const bearing = (
  mode: RotationMode,
  compassHeading: number,
  currentSegment: PathSegment,
) => {
  if (mode === 'user') {
    return compassHeading;
  }
  if (!currentSegment) {
    return compassHeading;
  }

  const [point1, point2] = currentSegment;
  const [lon1, lat1] = degPointToRadian(point1);
  const [lon2, lat2] = degPointToRadian(point2);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

const useBearing = (currentSegment: PathSegment) => {
  const { rotationMode } = useTurnByTurnContext();
  const { alpha, webkitCompassHeading } = useOrientation();
  const compassHeading = webkitCompassHeading ?? alpha;

  return bearing(rotationMode, compassHeading, currentSegment);
};

export const useUpdateMapView = (currentSegment: PathSegment) => {
  const location = useLocation();
  const bearing = useBearing(currentSegment);

  const map = getGlobalMap();
  if (!map || !location) {
    return;
  }

  const center = {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };

  map.flyTo({
    center,
    bearing,
    zoom: 18.5,
  });
};
