import { OsmId } from '../types';
import { fetchJson } from '../fetch';
import { getOsmNodesWaysUrl, isNodeOsmId, NodeOsmId } from './urls';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';
import { OsmResponse } from './types';

const getOsmNodesWaysPromise = async (apiId: NodeOsmId) =>
  fetchJson<OsmResponse<'way'>>(getOsmNodesWaysUrl(apiId));

export const fetchNodesWaysFeatures = async (apiId: OsmId) => {
  if (isNodeOsmId(apiId)) {
    const { elements } = await getOsmNodesWaysPromise(apiId);
    return elements.map((element) => addSchemaToFeature(osmToFeature(element)));
  }

  return [];
};
