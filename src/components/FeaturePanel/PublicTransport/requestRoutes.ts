import { fetchText } from '../../../services/fetch';
import { encodeUrl } from '../../../helpers/utils';

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
  ${featureType}(${id})-> .specific_feature;
    // Try to find stop_area relations containing the specific node and get their stops
    rel(bn.specific_feature)["public_transport"="stop_area"] -> .stop_areas;
    node(r.stop_areas: "stop") -> .stops;
    (
      rel(bn.stops)["route"~"bus|train|tram|subway|light_rail|ferry|monorail"];
      // If no stop_area, find routes that directly include the specific node
      rel(bn.specific_feature)["route"~"bus|train|tram|subway|light_rail|ferry|monorail"];
    );
    out;`;

  // send the request
  const response: string = await fetchText(
    encodeUrl`https://overpass-api.de/api/interpreter?data=${overpassQuery}`,
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
