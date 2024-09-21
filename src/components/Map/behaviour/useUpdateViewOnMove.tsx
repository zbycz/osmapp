import throttle from 'lodash/throttle';
import { createMapEventHook } from '../../helpers';
import { publishDbgObject } from '../../../utils';
import { Dispatch, SetStateAction } from 'react';
import { Bbox, View } from '../../utils/MapStateContext';

export const useUpdateViewOnMove = createMapEventHook<
  'move',
  [Dispatch<SetStateAction<View>>, Dispatch<SetStateAction<Bbox>>]
>((map, setViewFromMap, setBbox) => ({
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
      const bb: Bbox = [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()];
      setBbox(bb);
      publishDbgObject(
        'map bbox',
        bb.map((x) => x.toFixed(5)),
      );
    }
  }, 2000),
}));
