import { getApiId } from '../helpers';
import { fetchJson } from '../fetch';
import {
  getOverpassUrl,
  OverpassFeature,
  overpassGeomToGeojson,
} from '../overpass/overpassSearch';
import { FeatureTags, OsmId } from '../types';
import { publishDbgObject } from '../../utils';
import { TickStyle } from '../../components/FeaturePanel/Climbing/types';
import { ClimbingTick } from '../../types';

export type FetchedClimbingTick = {
  key: string;
  name: string;
  grade: string;
  center: number[];
  index: number;
  date: string;
  style: TickStyle;
  apiId: OsmId;
  tags: FeatureTags;
  tick: ClimbingTick;
};

export const getMyTicksFeatures = async (ticks): Promise<OverpassFeature[]> => {
  publishDbgObject('allTicks', ticks);

  const queryTicks = ticks
    .map(({ shortId }) => {
      if (!shortId) return '';
      const { id } = getApiId(shortId);
      return `node(${id});`;
    })
    .join('');
  const query = `[out:json];(${queryTicks});out body qt;`;
  const overpass = await fetchJson(getOverpassUrl(query));

  return overpassGeomToGeojson(overpass);
};
