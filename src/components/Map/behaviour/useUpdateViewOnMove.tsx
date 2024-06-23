import throttle from 'lodash/throttle';
import { createMapEventHook } from '../../helpers';
import { publishDbgObject } from '../../../utils';

export const useUpdateViewOnMove = createMapEventHook(
  (map, setViewFromMap, setBbox) => ({
    eventType: 'move',
    eventHandler: throttle(() => {
      const zoom = map.getZoom().toFixed(2);

      // Workaround of maplibre givin NaN https://github.com/zbycz/osmapp/issues/381
      if (zoom !== 'NaN') {
        setViewFromMap([
          zoom,
          map.getCenter().lat.toFixed(4),
          map.getCenter().lng.toFixed(4),
        ]);

        const b = map.getBounds();
        const bb = [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()];
        const bbox = bb.map((x) => x.toFixed(5));
        setBbox(bbox);
        publishDbgObject('map bbox', bbox);
      }
    }, 2000),
  }),
);
