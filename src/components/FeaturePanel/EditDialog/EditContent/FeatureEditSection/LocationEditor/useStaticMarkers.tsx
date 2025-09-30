import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import { Button, Stack, Typography } from '@mui/material';
import { createMapEffectHook } from '../../../../../helpers';
import { t } from '../../../../../../services/intl';
import { isGpsValid } from './isGpsValid';
import { useEditContext } from '../../../context/EditContext';
import { Setter } from '../../../../../../types';
import { EditDataItem } from '../../../context/types';

const GRAY_MARKER = {
  color: '#555',
  opacity: '0.4',
};

const useUpdateFeatureMarkers = createMapEffectHook<
  [
    {
      markerRefs: React.MutableRefObject<maplibregl.Marker[]>;
      items: EditDataItem[];
      setCurrent: Setter<string>;
      current: string;
    },
  ]
>((map, { items, markerRefs, setCurrent, current }) => {
  markerRefs.current.forEach((m) => m.remove());
  markerRefs.current = [];

  items.forEach((item) => {
    if (
      !isGpsValid(item.nodeLonLat) ||
      item.shortId === current ||
      item.shortId[0] !== 'n'
    ) {
      return;
    }
    const [lng, lat] = item.nodeLonLat;

    const marker = new maplibregl.Marker(GRAY_MARKER)
      .setLngLat({ lng, lat })
      .addTo(map);

    const popupContainer = document.createElement('div');

    const MyPopupContent = () => {
      return (
        <Stack direction="column" gap={2}>
          <Typography variant="subtitle2" color="primary">
            {item.tags?.name || item.shortId}
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

    const root = ReactDOM.createRoot(popupContainer);
    root.render(<MyPopupContent />);

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(
      popupContainer,
    );
    marker.setPopup(popup);

    markerRefs.current.push(marker);
  });
});

export function useFeatureMarkers(
  mapRef: React.MutableRefObject<maplibregl.Map>,
) {
  const { current, items, setCurrent } = useEditContext();
  const markerRefs = useRef<maplibregl.Marker[]>([]);

  useUpdateFeatureMarkers(mapRef.current, {
    markerRefs,
    items,
    setCurrent,
    current,
  });
}
