import { useAddMapEvent } from '../../helpers';

export const useIntegerZoomInRaster = useAddMapEvent((map, activeLayers) => ({
  eventType: 'moveend',
  eventHandler: () => {
    const isRaster =
      activeLayers[0] !== 'basic' && activeLayers[0] !== 'outdoor';

    const delta = parseFloat(window.location.search?.substring(1)) || 0.1;
    const zoomIsInVicinity =
      Math.abs(map.getZoom() % 1) < delta ||
      Math.abs(map.getZoom() % 1) > 1 - delta;
    if (isRaster && map.getZoom() % 1 !== 0 && zoomIsInVicinity) {
      map.setZoom(Math.round(map.getZoom()));
    }
  },
}));
