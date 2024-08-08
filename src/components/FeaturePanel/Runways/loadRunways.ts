import { fetchText } from '../../../services/fetch';
import { OsmApiId } from '../../../services/helpers';

export type Runway = {
  id: string;
  type: string;
  ref?: string;
  width?: string;
  length?: string;
  surface?: string;
};

export async function loadRunways({ id, type }: OsmApiId) {
  const isNode = type === 'node';

  const nodeQuery = `[out:csv(::id, ::type, ref, width, length, surface; false; '||')];
  node(${id}) -> .airport;
  way
    [aeroway=runway]
    (around.airport:100);
  out;`;
  const relationWayQuery = `[out:csv(::id, ::type, ref, width, length, surface; false; '||')];
  ${type}(${id});
  map_to_area;
  way
    [aeroway=runway]
    (area);
  out;`;

  const query = isNode ? nodeQuery : relationWayQuery;

  const response: string = await fetchText(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
  );

  return response
    .split('\n')
    .slice(0, -1)
    .map((line): Runway => {
      const [localId, localType, ref, width, length, surface] =
        line.split('||');

      return {
        id: localId,
        type: localType,
        ref: ref || undefined,
        width: width || undefined,
        length: length || undefined,
        surface: surface || undefined,
      };
    });
}
