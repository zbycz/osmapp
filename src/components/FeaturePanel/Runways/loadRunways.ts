import { fetchText } from '../../../services/fetch';

export type Runway = {
  id: string;
  type: string;
  ref?: string;
  width?: string;
  length?: string;
  surface?: string;
};

export async function loadRunways(id: string) {
  const query = `[out:csv(::id, ::type, ref, width, length, surface; false; '||')];
  wr(${id});
  map_to_area;
  way
    [aeroway=runway]
    (area);
  out;`;

  const response: string = await fetchText(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
  );

  return response
    .split('\n')
    .slice(0, -1)
    .map((line): Runway => {
      const [localId, type, ref, width, length, surface] = line.split('||');

      return {
        id: localId,
        type,
        ref: ref || undefined,
        width: width || undefined,
        length: length || undefined,
        surface: surface || undefined,
      };
    });
}
