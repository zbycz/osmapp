import { fetchJson } from '../../../services/fetch';
import { overpassGeomToGeojson } from '../../../services/overpassSearch';

export interface LineInformation {
  ref: string;
  colour: string | undefined;
  service: string | undefined;
}

export async function requestLines(featureType: string, id: number) {
  const overpassQueryJson = `[out:json];
  ${featureType}(${id});
  rel(bn)["public_transport"="stop_area"];
  node(r: "stop") -> .stops;
    rel(bn.stops)["route"~"bus|train|tram|subway|light_rail|ferry|monorail"];
    out geom qt;`;

  const geoJson = await fetchJson(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      overpassQueryJson,
    )}`,
  ).then(overpassGeomToGeojson);

  const resData = geoJson
    .map(
      ({ properties }): LineInformation => ({
        ref: `${properties.ref || properties.name}`,
        colour: properties.colour?.toString() || undefined,
        service: properties.service?.toString() || undefined,
      }),
    )
    .sort((a, b) => a.ref.localeCompare(b.ref, undefined, { numeric: true }))
    .filter(({ ref }) => ref !== '');

  return {
    geoJson: { type: 'FeatureCollection', features: geoJson },
    routes: resData.filter(
      (line, index) => resData.findIndex((l) => l.ref === line.ref) === index,
    ),
  };
}
