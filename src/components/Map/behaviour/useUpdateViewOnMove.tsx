import throttle from 'lodash/throttle';
import { useAddMapEvent } from '../../helpers';

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
      setBbox(bb.map((x) => x.toFixed(5)));
    }, 2000),
  }),
);
