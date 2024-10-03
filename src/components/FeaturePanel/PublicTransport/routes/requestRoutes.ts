import groupBy from 'lodash/groupBy';
import { fetchJson } from '../../../../services/fetch';
import {
  getOverpassUrl,
  overpassGeomToGeojson,
} from '../../../../services/overpassSearch';
import { intl } from '../../../../services/intl';

export interface LineInformation {
  ref: string;
  colour: string | undefined;
  service: string | undefined;
  osmType: string;
  osmId: string;
}

type WithTags = { tags: Record<string, string> };

const filterRoutesByRef = (routes: WithTags[], ref: string) =>
  routes.filter(({ tags }) => tags.ref === ref);

const getTagValue = (
  key: string,
  tags: Record<string, string>,
  routes: WithTags[],
) => {
  if (tags[key]) {
    return tags[key];
  }
  const altElement = routes.find(({ tags }) => tags[key]);
  if (altElement) {
    return altElement.tags[key];
  }
  return undefined;
};

const getService = (tags: Record<string, string>, routes: WithTags[]) => {
  const getVal = (key: string) => getTagValue(key, tags, routes);
  const serviceTagValue = getTagValue('service', tags, routes);
  const serviceTag =
    serviceTagValue === 'highspeed' ? 'high_speed' : serviceTagValue;
  const isHighspeed = getVal('highspeed') === 'yes';

  return (
    serviceTag ||
    (isHighspeed && 'high_speed') ||
    getVal('route') ||
    getVal('route_master')
  );
};

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
    (
      .routes;
      rel(br.routes);
    );
    out geom qt;`;

  const overpassGeom = await fetchJson(getOverpassUrl(overpassQuery));
  const grouped = groupBy(overpassGeom.elements, ({ tags }) => tags.type);
  const routeMasters = grouped.route_master || [];
  const routes = grouped.route || [];

  const geoJsonFeatures = overpassGeomToGeojson({ elements: routes });

  const geoJson: GeoJSON.GeoJSON = {
    type: 'FeatureCollection',
    features: geoJsonFeatures,
  };

  const allRoutes = routeMasters
    .map(({ type, id, tags }) => {
      const directionRouteTags = filterRoutesByRef(routes, tags.ref);
      const getVal = (key: string) =>
        getTagValue(key, tags, directionRouteTags);

      return {
        ref: `${tags.ref || tags.name}`,
        colour: getVal('colour'),
        service: getService(tags, directionRouteTags),
        osmId: `${id}`,
        osmType: type,
      };
    })
    .sort((a, b) => a.ref.localeCompare(b.ref, intl.lang, { numeric: true }));

  return {
    geoJson,
    routes: allRoutes,
  };
}
