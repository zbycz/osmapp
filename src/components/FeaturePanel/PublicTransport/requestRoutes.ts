import { fetchText } from '../../../services/fetch';

export interface LineInformation {
  ref: string;
  colour: string | undefined;
}

export async function requestLines(
  featureType: 'node' | 'way' | 'relation',
  id: number,
) {
  // use the overpass api to request the lines in
  const overpassQuery = `[out:csv(ref, colour; false; ';')];
  ${featureType}(${id});
  rel(bn)["public_transport"="stop_area"];
node(r: "stop") -> .stops;
    rel(bn.stops)["route"~"bus|train|tram|subway|light_rail|ferry|monorail"];
    out;`;

  // send the request
  const response: string = await fetchText(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      overpassQuery,
    )}`,
  );

  const resData = response
    .split('\n')
    .map((line) => {
      const ref = line.split(';').slice(0, -1).join(';');
      let colour = line.split(';')[line.split(';').length - 1];

      // set colour to undefined if it is empty
      if (colour === '') colour = undefined;
      return { ref, colour } as LineInformation;
    })
    .sort((a, b) => a.ref.localeCompare(b.ref, undefined, { numeric: true }))
    .filter(({ ref }) => ref !== '');

  return resData.filter(
    (line, index) => resData.findIndex((l) => l.ref === line.ref) === index,
  );
}
