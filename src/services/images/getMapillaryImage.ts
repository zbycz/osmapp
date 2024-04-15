import maplibregl from 'maplibre-gl';
import { fetchJson } from '../fetch';
import { Image, Position } from '../types';
import { getGlobalMap } from '../mapStorage';

const subtractAngle = (a: number, b: number): number =>
  Math.min(Math.abs(a - b), a - b + 360);

export const getBearing = ([aX, aY]: Position, [bX, bY]: Position): number => {
  const angle = (Math.atan2(bX - aX, bY - aY) * 180) / Math.PI;
  return angle < 0 ? angle + 360 : angle;
};

const debugOutput = (sorted) => {
  if (global?.window?.localStorage.getItem('debug_mapillary')) {
    console.log('Sorted photos:', sorted); // eslint-disable-line no-console
    sorted.forEach((item) => {
      new maplibregl.Marker({ rotation: item.compass_angle })
        .setLngLat(
          item.computed_geometry?.coordinates ?? item.geometry.coordinates,
        )
        .addTo(getGlobalMap());
    });
    new maplibregl.Marker({ rotation: sorted[0].compass_angle, color: '#f55' })
      .setLngLat(
        sorted[0].computed_geometry?.coordinates ??
          sorted[0].geometry.coordinates,
      )
      .addTo(getGlobalMap());
  }
};

const getMapillaryImageRaw = async (poiCoords: Position): Promise<Image> => {
  // https://www.mapillary.com/developer/api-documentation/#image
  // left, bottom, right, top (or minLon, minLat, maxLon, maxLat)
  const bbox = [
    poiCoords[0] - 0.0004,
    poiCoords[1] - 0.0004,
    poiCoords[0] + 0.0004,
    poiCoords[1] + 0.0004,
  ];
  // consider computed_compass_angle - but it is zero for many images, so we would have to fallback to compass_angle
  const url = `https://graph.mapillary.com/images?access_token=MLY|4742193415884187|44e43b57d0211d8283a7ca1c3e6a63f2&fields=compass_angle,computed_geometry,geometry,captured_at,thumb_1024_url,thumb_original_url,is_pano&bbox=${bbox}`;
  const { data } = await fetchJson(url);

  if (!data.length) {
    return undefined;
  }

  const photos = data.map((item) => {
    const photoCoords =
      item.computed_geometry?.coordinates ?? item.geometry.coordinates;
    const angleFromPhotoToPoi = getBearing(photoCoords, poiCoords);
    const deviationFromStraightSight = subtractAngle(
      angleFromPhotoToPoi,
      item.compass_angle,
    );
    return { ...item, angleFromPhotoToPoi, deviationFromStraightSight };
  });

  const panos = photos.filter((pic) => pic.is_pano);
  const sorted = (panos.length ? panos : photos).sort(
    (a, b) => a.deviationFromStraightSight - b.deviationFromStraightSight,
  );

  debugOutput(sorted);

  const imageToUse = sorted[0]; // it is save to assume that it has at least one element
  return {
    source: 'Mapillary',
    link: `https://www.mapillary.com/app/?focus=photo&pKey=${sorted[0].id}`,
    thumb: imageToUse.thumb_1024_url,
    sharp: imageToUse.thumb_original_url,
    timestamp: new Date(imageToUse.captured_at).toLocaleString(),
    isPano: imageToUse.is_pano,
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
