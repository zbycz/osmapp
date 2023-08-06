import { fetchText } from '../../../services/fetch';

interface LineInformation {
  ref: string;
  colour: string | undefined;
}

export async function requestLines(
  featureType: 'node' | 'way' | 'relation',
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

  let resData = response.split('\n').map((line) => {
    const ref = line.split(';').slice(0, -1).join(';');
    let colour = line.split(';')[line.split(';').length - 1];

    // set colour to undefined if it is empty
    if (colour === '') colour = undefined;
    return { ref, colour } as LineInformation;
  });

  resData = resData.filter((line) => line.ref !== '');
  // remove duplicats
  resData = resData.filter(
    (line, index) => resData.findIndex((l) => l.ref === line.ref) === index,
  );
  resData.sort((a, b) => a.ref.localeCompare(b.ref));
  return resData;
}
