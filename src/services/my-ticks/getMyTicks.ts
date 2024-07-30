import { getApiId, getShortId, OsmApiId } from '../helpers';
import { fetchJson } from '../fetch';
import { getOverpassUrl, overpassGeomToGeojson } from '../overpassSearch';
import { getAllTicks } from '../ticks';
import { Tick, TickStyle } from '../../components/FeaturePanel/Climbing/types';
import { getRouteGrade } from '../../components/FeaturePanel/Climbing/utils/grades/routeGrade';

export type TickRowType = {
  key: string;
  name: string;
  grade: string;
  center: number[];
  index: number;
  date: string;
  style: TickStyle;
  apiId: OsmApiId;
};

export const getMyTicks = async (userSettings): Promise<TickRowType[]> => {
  const allTicks = getAllTicks();

  const queryTicks = allTicks
    .map(({ osmId }) => {
      if (!osmId) return '';
      const { id } = getApiId(osmId);
      return `node(${id});`;
    })
    .join('');
  const query = `[out:json];(${queryTicks});out body qt;`;
  const overpass = await fetchJson(getOverpassUrl(query));

  const features = overpassGeomToGeojson(overpass);
  const featureMap = Object.keys(features).reduce((acc, key) => {
    const feature = features[key];
    return {
      ...acc,
      [getShortId(feature.osmMeta)]: feature,
    };
  }, {});

  return allTicks.map((tick: Tick, index) => {
    const feature = featureMap[tick.osmId];
    return {
      key: `${tick.osmId}-${tick.date}`,
      name: feature?.tags?.name,
      grade: getRouteGrade(feature?.tags, userSettings['climbing.gradeSystem']),
      center: feature?.center,
      index,
      date: tick.date,
      style: tick.style,
      apiId: getApiId(tick.osmId),
    };
  });
};
