import { fetchJson } from '../../../services/fetch';
import {
  getOverpassUrl,
  overpassGeomToGeojson,
} from '../../../services/overpassSearch';

export interface LineInformation {
  ref: string;
  colour: string | undefined;
  service: string | undefined;
  osmType: string;
  osmId: string;
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
    ) -> .routes;
    // Get the master relation
    rel(br.routes);
    out geom qt;`;

  const overpassGeom = await fetchJson(getOverpassUrl(overpassQuery));
  const geoJsonFeatures = overpassGeomToGeojson(overpassGeom);

  const geoJson: GeoJSON.GeoJSON = {
    type: 'FeatureCollection',
    features: geoJsonFeatures,
  };

  const allRoutes = geoJsonFeatures
    .map(
      ({ properties, osmMeta }): LineInformation => ({
        ref: `${properties.ref || properties.name}`,
        colour: properties.colour?.toString() || undefined,
        service: properties.service?.toString() || undefined,
        osmId: `${osmMeta.id}`,
        osmType: osmMeta.type,
      }),
    )
    .sort((a, b) => a.ref.localeCompare(b.ref, undefined, { numeric: true }))
    .filter(({ ref }) => ref !== '');

  return {
    geoJson,
    routes: allRoutes,
  };
}
