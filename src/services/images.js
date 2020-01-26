import { fetchText } from './helpers';

const getMapillaryUrl = async feature => {
  const lonlat = feature.geometry.coordinates.join(',');
  const url = `https://a.mapillary.com/v3/images?client_id=TTdNZ2w5eTF6MEtCNUV3OWNhVER2dzpjMjdiZGE1MWJmYzljMmJi&lookat=${lonlat}&closeto=${lonlat}&per_page=1`;
  const data = await fetchText(url);

  // {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"ca":71.80811,"camera_make":"Apple","camera_model":"iPhone6,2","captured_at":"2015-05-08T06:02:41.227Z","key":"rPU1sldzMCVIMN2XmjDf2A","pano":false,"sequence_key":"-zanzZ2HpdOhkw-uG166Pg","user_key":"M7Mgl9y1z0KB5Ew9caTDvw","username":"zbycz"},"geometry":{"type":"Point","coordinates":[14.390517,50.100268]}}]}
  const { features } = JSON.parse(data);
  if (features.length) {
    const image = features[0];
    const { key } = image.properties;
    return `https://images.mapillary.com/${key}/thumb-640.jpg`;
  }
};

export const getFeatureImageUrl = async feature => {
  try {
    return await getMapillaryUrl(feature);
  } catch (e) {
    console.log(e);
    return '#';
  }
};
