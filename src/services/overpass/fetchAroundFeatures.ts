import { Feature, Position } from '../types';
import { getOverpassUrl } from './overpassSearch';
import { fetchJson } from '../fetch';
import { overpassAroundToSkeletons } from './overpassAroundToSkeletons';

const getAroundUrl = ([lat, lon]: Position) =>
  getOverpassUrl(
    `[timeout:5][out:json];(
        relation[~"."~"."](around:50,${lon},${lat});
        way[~"."~"."](around:50,${lon},${lat});
        node[~"."~"."](around:50,${lon},${lat});
      );out body qt center;`,
  );

export const fetchAroundFeatures = async (
  point: Position,
): Promise<Feature[]> => {
  const response = await fetchJson(getAroundUrl(point));
  return overpassAroundToSkeletons(response);
};
