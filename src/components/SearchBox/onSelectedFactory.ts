import Router from 'next/router';
import { getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';

const getSkeleton = (location) => {
  const { lat, lon, properties, place_name: name } = location;
  const { osm_id: osmId } = properties;
  let type; let id;
  if (osmId.startsWith('relation')) {
    type = 'relation';
    id = osmId.substr(8);
  }
  if (osmId.startsWith('way')) {
    type = 'way';
    id = osmId.substr(3);
  }
  if (osmId.startsWith('node')) {
    type = 'node';
    id = osmId.substr(4);
  }

  return {
    loading: true,
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id },
    center: [parseFloat(lon), parseFloat(lat)],
    tags: { name },
    properties: { class: location.class },
  };
};

export const onHighlightFactory = (setPreview) => (e, location) => {
  if (!location?.lat) return;
  setPreview({ ...getSkeleton(location), noPreviewButton: true });
};

export const onSelectedFactory =
  (setFeature, setPreview, setView, mobileMode) => (e, location) => {
    if (!location?.lat) return;

    const { lat, lon } = location;
    const skeleton = getSkeleton(location);
    console.log('Search item selected:', { location, skeleton }); // eslint-disable-line no-console

    addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

    if (mobileMode) {
      setPreview(skeleton);
      setView([17, lat, lon]);
      return;
    }

    setPreview(null);
    setFeature(skeleton);
    setView([17, lat, lon]);
    Router.push(`/${getUrlOsmId(skeleton.osmMeta)}${window.location.hash}`);
  };
