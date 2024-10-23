import { isServer } from '../../components/helpers';
import { fetchJson } from '../fetch';
import { getShortId, prod } from '../helpers';
import { Feature } from '../types';
import { LandmarkView } from './views';

const getViewUrl = (shortId: string) => {
  const end = `/camera-view?shortId=${shortId}`;
  if (!isServer()) {
    return end;
  }
  if (prod) {
    return `https://osmapp.org${end}`;
  }
  // TODO: Find the *right* url also for preview deployments
  return `http://localhost:3000${end}`;
};

const getView = async ({ osmMeta }: Feature) => {
  const shortId = getShortId(osmMeta);
  const cameraViewUrl = getViewUrl(shortId);
  return fetchJson<LandmarkView | null>(cameraViewUrl);
};

export const addLandmarkView = async (feature: Feature): Promise<Feature> => {
  try {
    const view = await getView(feature);
    return {
      ...feature,
      landmarkView: view,
    };
  } catch {
    return feature;
  }
};
