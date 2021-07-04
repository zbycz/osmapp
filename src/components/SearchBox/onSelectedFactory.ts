import Router from 'next/router';
import { getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';

const getSkeleton = (location) => {
  const { lat, lon, osm_type: type, osm_id: id, display_name: name } = location;
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
