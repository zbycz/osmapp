import maplibregl from 'maplibre-gl';
import { fetchJson } from '../fetch';
import { Position } from '../types';
import { getGlobalMap } from '../mapStorage';
import { ImageType } from './getImageDefs';

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

type MapillaryResponse = {
  data: {
    compass_angle: number;
    computed_geometry: {
      type: string;
      coordinates: number[];
    };
    geometry: {
      type: string;
      coordinates: number[];
    };
    captured_at: number;
    thumb_1024_url: string;
    thumb_original_url: string;
    is_pano: boolean;
    id: string;
  }[];
};

export const getMapillaryImage = async (
  poiCoords: Position,
): Promise<ImageType | null> => {
  // https://www.mapillary.com/developer/api-documentation/#image
  const bbox = [
    poiCoords[0] - 0.0004, // left, bottom, right, top (or minLon, minLat, maxLon, maxLat)
    poiCoords[1] - 0.0004,
    poiCoords[0] + 0.0004,
    poiCoords[1] + 0.0004,
  ];
  // consider computed_compass_angle - but it is zero for many images, so we would have to fallback to compass_angle
  const url = `https://graph.mapillary.com/images?access_token=MLY|4742193415884187|44e43b57d0211d8283a7ca1c3e6a63f2&fields=compass_angle,computed_geometry,geometry,captured_at,thumb_1024_url,thumb_original_url,is_pano&bbox=${bbox}`;
  const { data } = await fetchJson<MapillaryResponse>(url);

  if (!data.length) {
    return null;
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
  const timestamp = new Date(imageToUse.captured_at).toLocaleString();
  const isPano = imageToUse.is_pano;

  return {
    imageUrl: imageToUse.thumb_1024_url,
    description: `Mapillary image from ${timestamp}`,
    linkUrl: `https://www.mapillary.com/app/?focus=photo&pKey=${sorted[0].id}`,
    link: sorted[0].id,
    uncertainImage: true,
    panoramaUrl: isPano ? imageToUse.thumb_original_url : undefined,
  };
};
