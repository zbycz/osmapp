import { fetchText } from '../../../services/fetch';
import { OsmId } from '../../../services/types';
import { encodeUrl } from '../../../helpers/utils';

export type Runway = {
  id: string;
  type: string;
  ref?: string;
  width?: string;
  length?: string;
  surface?: string;
};

const getNodeQuery = ({ id }: OsmId) =>
  `[out:csv(::id, ::type, ref, width, length, surface; false; '||')];
    node(${id}) -> .airport;
    way
      [aeroway=runway]
      (around.airport:100);
    out;`;

const getWayOrRelationQuery = ({ id, type }: OsmId) =>
  `[out:csv(::id, ::type, ref, width, length, surface; false; '||')];
    ${type}(${id});
    map_to_area;
    way
      [aeroway=runway]
      (area);
    out;`;

export async function loadRunways(apiId: OsmId) {
  const isNode = apiId.type === 'node';
  const query = isNode ? getNodeQuery(apiId) : getWayOrRelationQuery(apiId);
  const url = encodeUrl`https://overpass-api.de/api/interpreter?data=${query}`;
  const response: string = await fetchText(url);

  return response
    .split('\n')
    .slice(0, -1)
    .map((line): Runway => {
      const [id, type, ref, width, length, surface] = line.split('||');

      return {
        id,
        type,
        ref: ref || undefined,
        width: width || undefined,
        length: length || undefined,
        surface: surface || undefined,
      };
    });
}
