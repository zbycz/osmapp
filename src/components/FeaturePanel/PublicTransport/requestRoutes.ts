import { fetchText } from '../../../services/fetch';

interface LineInformation {
  ref: string;
  colour: string | undefined;
}

export async function requestLines(
  featureType: 'node' | 'way' | 'rel',
  id: number,
  radius = 150,
) {
  // use the overpass api to request the lines in
  const overpassQuery = `[out:csv(ref, colour; false; ';')];
    ${featureType}(${id})->.center;
    node(around.center:${radius})["public_transport"="stop_position"] -> .stops;
    rel(bn.stops)["route"~"bus|train|tram|subway|light_rail"];
    out;`;

  // send the request
  const response: string = await fetchText(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      overpassQuery,
    )}`,
  );

  const resData = response.split('\n').map((line) => {
    const ref = line.split(';')[0];
    let colour = line.split(';')[1];

    // set colour to undefined if it is empty
    if (colour === '') colour = undefined;
    return { ref, colour } as LineInformation;
  });

  return resData;
}
