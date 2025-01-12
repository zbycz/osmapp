import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import maplibregl from 'maplibre-gl';
import { Button, Stack, Typography } from '@mui/material';
import { createMapEffectHook } from '../../../../../helpers';
import { t } from '../../../../../../services/intl';

const useUpdateFeatureMarkers = createMapEffectHook<
  [
    {
      markerRefs: React.MutableRefObject<maplibregl.Marker[]>;
      items: any[];
      setCurrent: (shortId: string) => void;
      current: string;
    },
  ]
>((map, { items, markerRefs, setCurrent, current }) => {
  markerRefs.current.forEach((m) => m.remove());
  markerRefs.current = [];

  items.forEach((item) => {
    if (!item.nodeLonLat || item.shortId === current) return;
    const [lng, lat] = item.nodeLonLat;

    const marker = new maplibregl.Marker({
      color: '#555',
      opacity: '0.4',
    })
      .setLngLat({
        lng: parseFloat(lng.toFixed(6)),
        lat: parseFloat(lat.toFixed(6)),
      })
      .addTo(map);

    const popupContainer = document.createElement('div');

    const MyPopupContent = () => {
      return (
        <Stack direction="column" gap={2}>
          <Typography variant="subtitle2" color="primary">
            {item.tags.name}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => setCurrent(item.shortId)}
          >
            {t('editdialog.location_change_current_item')}
          </Button>
        </Stack>
      );
    };

    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<MyPopupContent />, popupContainer);

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(
      popupContainer,
    );
    marker.setPopup(popup);

    markerRefs.current.push(marker);
  });
});

export function useFeatureMarkers(
  mapRef: React.MutableRefObject<maplibregl.Map>,
  items: any[],
  setCurrent: (shortId: string) => void,
  current: string,
) {
  const markerRefs = useRef<maplibregl.Marker[]>([]);

  useUpdateFeatureMarkers(mapRef.current, {
    markerRefs,
    items,
    setCurrent,
    current,
  });
}
