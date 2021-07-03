import { fetchJson } from '../fetch';
import { removeFetchCache } from '../fetchCache';
import { Image, Position } from '../types';

const getMapillaryImageRaw = async (center: Position): Promise<Image> => {
  const lonlat = center.map((x) => x.toFixed(5)).join(',');
  const url = `https://a.mapillary.com/v3/images?client_id=TTdNZ2w5eTF6MEtCNUV3OWNhVER2dzpjMjdiZGE1MWJmYzljMmJi&lookat=${lonlat}&closeto=${lonlat}`;
  const { features } = await fetchJson(url);

  // {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"ca":71.80811,"camera_make":"Apple","camera_model":"iPhone6,2","captured_at":"2015-05-08T06:02:41.227Z","key":"rPU1sldzMCVIMN2XmjDf2A","pano":false,"sequence_key":"-zanzZ2HpdOhkw-uG166Pg","user_key":"M7Mgl9y1z0KB5Ew9caTDvw","username":"zbycz"},"geometry":{"type":"Point","coordinates":[14.390517,50.100268]}}]}
  if (!features.length) {
    removeFetchCache(url); // mapillary sometimes returns image on second try (lets not cache the first try)
    return undefined;
  }

  const image = features[0];
  const { key, username } = image.properties;
  return {
    source: 'Mapillary',
    username,
    link: `https://www.mapillary.com/app/?focus=photo&pKey=${key}`,
    thumb: `https://images.mapillary.com/${key}/thumb-640.jpg`,
  };
};

export const getMapillaryImage = async (center: Position): Promise<Image> => {
  try {
    return await getMapillaryImageRaw(center);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
};
