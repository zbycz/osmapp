import { useMapStateContext } from '../utils/MapStateContext';
import { fetchFromApi } from '../../services/osmApi';

export const onSelectedFactory = (setFeature, setView) => async (e, loc) => {
  if (!loc || !loc.lat) return;

  const {
    lat, lon, osm_type: type, osm_id: id, display_name,
  } = loc;

  console.log('Location selected:', loc);
  const skeleton = {
    loading: true,
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id },
    center: [parseFloat(lon), parseFloat(lat)],
    tags: { name: display_name },
    properties: { class: loc.class },
  };
  console.log('-->skeleton:', skeleton);
  setFeature(skeleton);
  setView([17, lat, lon]);
  setFeature(await fetchFromApi(skeleton.osmMeta));
};
