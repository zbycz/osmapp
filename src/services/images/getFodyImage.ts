import { fetchJson } from '../fetch';
import type { LonLat } from '../types';
import type { ImageType } from './getImageDefs';

export const getFodyImage = async (
  center: LonLat,
): Promise<ImageType | null> => {
  const url = `https://osm.fit.vutbr.cz/fody/api/close?lat=${center[1]}&lon=${center[0]}&limit=1&distance=50`;
  const { features } = await fetchJson(url);
  if (!features.length) {
    return null;
  }

  const image = features[0];
  const { id, author, created } = image.properties;

  return {
    imageUrl: `https://osm.fit.vutbr.cz/fody/files/250px/${id}.jpg`,
    description: `Fody photodb from ${author} (${created})`,
    linkUrl: `https://osm.fit.vutbr.cz/fody/?id=${id}`,
    link: id,
    // portrait: true,
  };
};
