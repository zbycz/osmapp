import Router from 'next/router';
import { getShortId, getUrlOsmId } from '../../services/helpers';
import { addFeatureCenterToCache } from '../../services/osmApi';

export const onSelectedFactory =
  (setFeature, setView) => async (e, location) => {
    if (!location?.lat) return;

    const {
      lat,
      lon,
      osm_type: type,
      osm_id: id,
      display_name: name,
    } = location;

    const skeleton = {
      loading: true,
      skeleton: true,
      nonOsmObject: false,
      osmMeta: { type, id },
      center: [parseFloat(lon), parseFloat(lat)],
      tags: { name },
      properties: { class: location.class },
    };

    console.log('Search item selected:', { location, skeleton }); // eslint-disable-line no-console

    addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

    setFeature(skeleton);
    setView([17, lat, lon]);
    Router.push(`/${getUrlOsmId(skeleton.osmMeta)}${window.location.hash}`);
  };
