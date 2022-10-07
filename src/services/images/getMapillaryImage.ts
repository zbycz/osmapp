import { fetchJson } from '../fetch';
import { Image, Position } from '../types';
import { getGlobalMap } from "../mapStorage";
import maplibregl from "maplibre-gl";

const subtractAngle = (a: number, b: number): number =>
  Math.min(Math.abs(a - b), a - b + 360);

export const getBearing = ([aX, aY]: Position, [bX, bY]: Position): number => {
  const angle = (Math.atan2(bX - aX, bY - aY) * 180) / Math.PI;
  return angle < 0 ? angle + 360 : angle;
};

const getMapillaryImageRaw = async (poiCoords: Position): Promise<Image> => {
  const bbox = `${poiCoords[0] - 0.0004},${poiCoords[1] - 0.0004},${
    poiCoords[0] + 0.0004
  },${poiCoords[1] + 0.0004}`;

  // https://www.mapillary.com/developer/api-documentation/#image
  // left, bottom, right, top (or minLon, minLat, maxLon, maxLat)
  // consider computed_compass_angle - it is zero for many images, so we would have to fallback to compass_angle
  const url = `https://graph.mapillary.com/images?access_token=MLY|4742193415884187|44e43b57d0211d8283a7ca1c3e6a63f2&fields=compass_angle,computed_geometry,captured_at,thumb_1024_url&bbox=${bbox}`;
  const { data } = await fetchJson(url);

  if (!data.length) {
    return undefined;
  }

  const itemsWithDeviation = data.map((item) => {
    const photoCoords = item.computed_geometry.coordinates;
    const angleFromPhotoToPoi = getBearing(photoCoords, poiCoords);
    const deviationFromStraightSight = subtractAngle(
      angleFromPhotoToPoi,
      item.compass_angle,
    );

    new maplibregl.Marker({ rotation: item.compass_angle })
      .setLngLat(photoCoords)
      .addTo(getGlobalMap());

    return { ...item, angleFromPhotoToPoi, deviationFromStraightSight };
  });

  console.log({ itemsWithDeviation });

  const closest = itemsWithDeviation.reduce((acc, item) =>
    acc.deviationFromStraightSight < item.deviationFromStraightSight
      ? acc
      : item,
  );

  new maplibregl.Marker({ rotation: closest.compass_angle, color: '#eb5757' })
    .setLngLat(closest.computed_geometry.coordinates)
    .addTo(getGlobalMap());

  return {
    source: 'Mapillary',
    link: `https://www.mapillary.com/app/?focus=photo&pKey=${closest.id}`,
    thumb: closest.thumb_1024_url,
    timestamp: new Date(closest.captured_at).toLocaleString()
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
