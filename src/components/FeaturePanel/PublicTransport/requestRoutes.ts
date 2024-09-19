import { fetchJson } from '../../../services/fetch';
import { overpassGeomToGeojson } from '../../../services/overpassSearch';

export interface LineInformation {
  ref: string;
  colour: string | undefined;
  service: string | undefined;
}

export async function requestLines(featureType: string, id: number) {
  const overpassQuery = `[out:json];
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

  const geoJson = await fetchJson(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      overpassQuery,
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
