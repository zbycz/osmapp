import { fetchText } from '../../../services/fetch';

export interface LineInformation {
  ref: string;
  colour: string | undefined;
  service: string | undefined;
}

export async function requestLines(
  featureType: 'node' | 'way' | 'relation',
  id: number,
) {
  // use the overpass api to request the lines in
  const overpassQuery = `[out:csv(service, colour, ref; false; ';;')];
  ${featureType}(${id});
  rel(bn)["public_transport"="stop_area"];
  node(r: "stop") -> .stops;
    rel(bn.stops)["route"~"bus|train|tram|subway|light_rail|ferry|monorail"];
    out;`;

  const response: string = await fetchText(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      overpassQuery,
    )}`,
  );

  const resData = response
    .split('\n')
    .slice(0, -1)
    .map((line) => {
      const [service, colour, ref] = line.split(';;');

      return {
        ref,
        colour: colour || undefined,
        service: service || undefined,
      } as LineInformation;
    })
    .sort((a, b) => a.ref.localeCompare(b.ref, undefined, { numeric: true }))
    .filter(({ ref }) => ref !== '');

  return resData.filter(
    (line, index) => resData.findIndex((l) => l.ref === line.ref) === index,
  );
}
