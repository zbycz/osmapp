import { getApiId } from '../helpers';
import { fetchJson } from '../fetch';
import {
  getOverpassUrl,
  OverpassFeature,
  overpassGeomToGeojson,
} from '../overpass/overpassSearch';
import { getAllTicks } from './ticks';
import { TickStyle } from '../../components/FeaturePanel/Climbing/types';
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

export const getMyTicksFeatures = async (
  userSettings,
): Promise<OverpassFeature[]> => {
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
  return features;
};
