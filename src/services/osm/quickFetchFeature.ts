import { Feature, OsmId } from '../types';
import { osmToFeature } from './osmToFeature';
import { FetchError } from '../helpers';
import { fetchJson } from '../fetch';
import { OsmResponse } from './types';
import { getOsmUrl } from './urls';

export const getOsmElement = async (apiId: OsmId) => {
  const { elements } = await fetchJson<OsmResponse>(getOsmUrl(apiId)); // TODO 504 gateway busy
  return elements?.[0];
};

export const quickFetchFeature = async (apiId: OsmId) => {
  try {
    const element = await getOsmElement(apiId);
    return osmToFeature(element);
  } catch (e) {
    return {
      error: e instanceof FetchError ? e.code : 'unknown',
    } as unknown as Feature;
  }
};
