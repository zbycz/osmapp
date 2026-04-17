import { Feature, LonLat } from '../types';
import { overpassAroundToSkeletons } from './overpassAroundToSkeletons';
import { fetchOverpass } from './fetchOverpass';

const fetchAround = ([lat, lon]: LonLat) =>
  fetchOverpass(
    `[timeout:5][out:json];(
        relation[~"."~"."](around:50,${lon},${lat});
        way[~"."~"."](around:50,${lon},${lat});
        node[~"."~"."](around:50,${lon},${lat});
      );out body qt center;`,
  );

export const fetchAroundFeatures = async (
  point: LonLat,
): Promise<Feature[]> => {
  const response = await fetchAround(point);
  return overpassAroundToSkeletons(response);
};
