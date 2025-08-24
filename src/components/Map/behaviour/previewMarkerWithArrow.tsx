import maplibregl, { Map, Point } from 'maplibre-gl';
import styled from '@emotion/styled';
import { createMapEffectHook, isMobileModeVanilla } from '../../helpers';
import { FEATURE_PANEL_WIDTH } from '../../utils/PanelHelpers';
import { Feature } from '../../../services/types';

export const PreviewArrow = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #556cd6;
  clip-path: polygon(0 0, 100% 50%, 0 100%, 25% 50%);
  transform-origin: 50% 50%;
  pointer-events: none;
  display: none;
  z-index: 10000;
`;

const intersectRect = (
  left: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  w: number,
  h: number,
  margin: number = 10,
): [number, number] | null => {
  const tVals: number[] = [];

  if (dx !== 0) {
    tVals.push((left - cx) / dx);
    tVals.push((w - cx) / dx);
  }
  if (dy !== 0) {
    tVals.push((0 - cy) / dy);
    tVals.push((h - cy) / dy);
  }

  let best: [number, number] | null = null;
  let bestT = Infinity;

  for (const t of tVals) {
    if (t > 0) {
      const x = cx + dx * t;
      const y = cy + dy * t;

      const E = 1e-4; // epsilon tolerance
      if (x >= -E && x <= w + E && y >= -E && y <= h + E && t < bestT) {
        best = [x, y];
        bestT = t;
      }
    }
  }

  if (!best) {
    return null;
  }

  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  return [best[0] - ux * margin, best[1] - uy * margin];
};

const isInsideBounds = (
  markerPixel: Point,
  left: number,
  w: number,
  h: number,
) => {
  return (
    markerPixel.x >= left &&
    markerPixel.x <= w &&
    markerPixel.y >= 0 &&
    markerPixel.y <= h
  );
};

export let previewMarker: maplibregl.Marker;

export const updateArrowFactory = (map: Map, isPanelOpen: boolean) => () => {
  const arrow = document.getElementById('preview-arrow');
  if (!arrow) return;

  if (!previewMarker || (isMobileModeVanilla() && isPanelOpen)) {
    arrow.style.display = 'none';
    return;
  }

  const left = isPanelOpen ? FEATURE_PANEL_WIDTH : 0;

  const canvas = map.getCanvas();
  const w = canvas.width;
  const h = canvas.height;
  const markerPixel = map.project(previewMarker.getLngLat());

  if (isInsideBounds(markerPixel, left, w, h)) {
    arrow.style.display = 'none';
    return;
  }

  const centerPixel = { x: left + (w - left) / 2, y: h / 2 };
  const dx = markerPixel.x - centerPixel.x;
  const dy = markerPixel.y - centerPixel.y;
  const angle = Math.atan2(dy, dx);

  const edge = intersectRect(left, centerPixel.x, centerPixel.y, dx, dy, w, h);
  if (edge) {
    arrow.style.left = `${edge[0] - 10}px`;
    arrow.style.top = `${edge[1] - 10}px`;
    arrow.style.transform = `rotate(${angle}rad)`;
    arrow.style.display = 'block';
  } else {
    arrow.style.display = 'none';
  }
};

const PREVIEW_MARKER = {
  color: '#556cd6',
  draggable: false,
};

export const useUpdatePreviewMarker = createMapEffectHook<[Feature, boolean]>(
  (map, feature, isPanelOpen) => {
    previewMarker?.remove();
    previewMarker = undefined;

    const point = feature?.center as [number, number];

    if (point) {
      previewMarker = new maplibregl.Marker(PREVIEW_MARKER)
        .setLngLat(point)
        .addTo(map);

      const updateArrow = updateArrowFactory(map, isPanelOpen);
      updateArrow();

      map.on('move', updateArrow);

      return () => {
        map.off('move', updateArrow);
        previewMarker?.remove();
        previewMarker = undefined;
        const arrow = document.getElementById('preview-arrow');
        if (arrow) {
          arrow.style.display = 'none';
        }
      };
    }
  },
);
