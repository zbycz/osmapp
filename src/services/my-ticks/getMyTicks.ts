import { getApiId, getShortId } from '../helpers';
import { fetchJson } from '../fetch';
import {
  getOverpassUrl,
  overpassGeomToGeojson,
} from '../overpass/overpassSearch';
import { getAllTicks, getTickKey } from './ticks';
import { Tick, TickStyle } from '../../components/FeaturePanel/Climbing/types';
import {
  findOrConvertRouteGrade,
  getDifficulties,
} from '../../components/FeaturePanel/Climbing/utils/grades/routeGrade';
import { FeatureTags, OsmId } from '../types';
import { publishDbgObject } from '../../utils';

export type TickRowType = {
  key: string;
  name: string;
  grade: string;
  center: number[];
  index: number;
  date: string;
  style: TickStyle;
  apiId: OsmId;
  tags: FeatureTags;
};

export const getMyTicks = async (userSettings): Promise<TickRowType[]> => {
  const allTicks = getAllTicks();
  publishDbgObject('allTicks', allTicks);

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

  const tickRows = allTicks.map((tick: Tick, index) => {
    const feature = featureMap[tick.osmId];
    const difficulties = getDifficulties(feature?.tags);
    const { routeDifficulty } = findOrConvertRouteGrade(
      difficulties,
      userSettings['climbing.gradeSystem'],
    );

    return {
      key: getTickKey(tick),
      name: feature?.tags?.name,
      grade: routeDifficulty.grade,
      center: feature?.center,
      index,
      date: tick.date,
      style: tick.style,
      apiId: getApiId(tick.osmId),
      tags: feature?.tags,
    };
  });

  publishDbgObject('tickRows', tickRows);

  return tickRows;
};
