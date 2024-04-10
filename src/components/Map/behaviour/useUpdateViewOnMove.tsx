import throttle from 'lodash/throttle';
import { useAddMapEvent } from '../../helpers';
import { publishDbgObject } from '../../../utils';

export const useUpdateViewOnMove = useAddMapEvent(
  (map, setViewFromMap, setBbox) => ({
    eventType: 'move',
    eventHandler: throttle(() => {
      setViewFromMap([
        map.getZoom().toFixed(2),
        map.getCenter().lat.toFixed(4),
        map.getCenter().lng.toFixed(4),
      ]);

      const b = map.getBounds();
      // <lon x1>,<lat y1>,<x2>,<y2>
      const bb = [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()];
      const bbox = bb.map((x) => x.toFixed(5));
      setBbox(bbox);
      publishDbgObject('map bbox', bbox);
    }, 2000),
  }),
);
