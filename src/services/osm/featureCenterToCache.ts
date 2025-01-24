import { LonLat } from '../types';
import { publishDbgObject } from '../../utils';

/**
 * This holds coords of clicked ways/relations (from vector map), these are often different than those computed by us
 * TODO: we should probably store just the last one, but this cant get too big, right?
 */
export const featureCenterCache: Record<string, LonLat> = {};

export const addFeatureCenterToCache = (shortId: string, center: LonLat) => {
  featureCenterCache[shortId] = center;
  publishDbgObject('featureCenterCache', featureCenterCache);
};
