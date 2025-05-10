import { Feature, OsmId } from '../types';
import { fetchJson } from '../fetch';
import { getOsmParentUrl } from './urls';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';
import { OsmResponse } from './types';

const getOsmParentPromise = async (apiId: OsmId) =>
  fetchJson<OsmResponse>(getOsmParentUrl(apiId));

export const fetchParentFeatures = async (apiId: OsmId): Promise<Feature[]> => {
  if (apiId.id < 0) {
    return [];
  }

  const { elements } = await getOsmParentPromise(apiId);
  return elements.map((element) => addSchemaToFeature(osmToFeature(element)));
};
