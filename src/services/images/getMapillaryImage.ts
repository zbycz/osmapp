import { fetchJson } from '../fetch';
import { Image, Position } from '../types';

const deltaAngle = (a: number, b: number): number =>
  Math.min(Math.abs(a - b), a - b + 360);

const bearing = (a1: number, a2: number, b1: number, b2: number): number => {
  const rad2deg = 57.2957795130823209;
  if (a1 === b1 && a2 === b2) return Infinity;
  let theta = Math.atan2(b1 - a1, a2 - b2);
  if (theta < 0) theta += Math.PI * 2;
  return rad2deg * theta;
};

const getMapillaryImageRaw = async (pPoi: Position): Promise<Image> => {
  const bbox = `${pPoi[0] - 0.0004},${pPoi[1] - 0.0004},${pPoi[0] + 0.0004},${
    pPoi[1] + 0.0004
  }`;
  const url = `https://graph.mapillary.com/images?access_token=MLY|4742193415884187|44e43b57d0211d8283a7ca1c3e6a63f2&fields=compass_angle,computed_geometry,captured_at,thumb_1024_url&bbox=${bbox}`;
  const { data } = await fetchJson(url);

  let bestImg = null;

  for (let i = 0; i < data.length; i += 1) {
    const pImg = data[i].computed_geometry.coordinates;
    const bear = bearing(pImg[0], pImg[1], pPoi[0], pPoi[1]);
    data[i].angleToPoi = deltaAngle(bear, data[i].compass_angle);
    if (
      data[i].angleToPoi < 50 &&
      (bestImg == null || bestImg.angleToPoi > data[i].angleToPoi)
    ) {
      bestImg = data[i];
    }
  }

  if (bestImg === null) return undefined;

  return {
    source: 'Mapillary',
    link: `https://www.mapillary.com/app/?focus=photo&pKey=${bestImg.id}`,
    thumb: bestImg.thumb_1024_url,
  };
};

export const getMapillaryImage = async (center: Position): Promise<Image> => {
  try {
    return await getMapillaryImageRaw(center);
  } catch (e) {
    console.warn(e); // eslint-disable-line no-console
    return undefined;
  }
};
