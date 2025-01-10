import { OsmId } from '../types';
import { fetchJson } from '../fetch';
import { getOsmParentUrl } from './urls';
import { addSchemaToFeature } from '../tagging/idTaggingScheme';
import { osmToFeature } from './osmToFeature';

const getOsmParentPromise = async (apiId: OsmId) => {
  const { elements } = await fetchJson(getOsmParentUrl(apiId));
  return { elements };
};

export const fetchParentFeatures = async (apiId: OsmId) => {
  const { elements } = await getOsmParentPromise(apiId);
  return elements.map((element) => addSchemaToFeature(osmToFeature(element)));
};
