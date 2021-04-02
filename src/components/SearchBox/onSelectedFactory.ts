import Router from 'next/router';
import { getUrlOsmId } from '../../services/helpers';

export const onSelectedFactory = (setFeature, setView) => async (e, loc) => {
  if (!loc || !loc.lat) return;

  const { lat, lon, osm_type: type, osm_id: id, display_name: name } = loc;

  console.log('Location selected:', loc); // eslint-disable-line no-console
  const skeleton = {
    loading: true,
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id },
    center: [parseFloat(lon), parseFloat(lat)],
    tags: { name },
    properties: { class: loc.class },
  };
  console.log('-->skeleton:', skeleton); // eslint-disable-line no-console
  setFeature(skeleton);
  setView([17, lat, lon]);
  Router.push(`/${getUrlOsmId(skeleton.osmMeta)}`);
};
