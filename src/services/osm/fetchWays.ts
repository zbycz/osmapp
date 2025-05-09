import { OsmId } from '../types';
import { fetchJson } from '../fetch';
import { getOsmWaysUrl, isNodeOsmId, NodeOsmId } from './urls';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';
import { OsmResponse } from './types';

const getOsmWaysPromise = async (apiId: NodeOsmId) =>
  fetchJson<OsmResponse<'way'>>(getOsmWaysUrl(apiId));

export const fetchWays = async (apiId: OsmId) => {
  if (isNodeOsmId(apiId)) {
    const { elements } = await getOsmWaysPromise(apiId);
    return elements.map((element) => addSchemaToFeature(osmToFeature(element)));
  }

  return [];
};
