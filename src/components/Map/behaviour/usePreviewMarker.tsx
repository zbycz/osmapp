import maplibregl, { Map, Point } from 'maplibre-gl';
import styled from '@emotion/styled';
import { isMobileModeVanilla } from '../../helpers';
import { FEATURE_PANEL_WIDTH } from '../../utils/PanelHelpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PREVIEW_MARKER = {
  color: '#556cd6',
  draggable: false,
};

const ArrowIcon = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: ${PREVIEW_MARKER.color};
  clip-path: polygon(0 0, 100% 50%, 0 100%, 25% 50%);
  transform-origin: 50% 50%;
  pointer-events: none;
  display: none;
  z-index: 10000;
`;

export const PreviewArrow = () => <ArrowIcon id="preview-arrow" />;

const intersectionVisible = (
  x: number,
  y: number,
  w: number,
  h: number,
  left: number,
) => {
  const E = 1e-3; // epsilon tolerance, due to float precision
  return x >= left - E && x <= w + E && y >= -E && y <= h + E;
};

const movePoint10pxInside = (
  point: [number, number],
  dx: number,
  dy: number,
): [number, number] => {
  const MARGIN = 10;
  const len = Math.sqrt(dx * dx + dy * dy);
  const dxUnit = dx / len;
  const dyUnit = dy / len;
  return [point[0] - dxUnit * MARGIN, point[1] - dyUnit * MARGIN];
};

const intersectRect = (
  left: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  w: number,
  h: number,
): [number, number] | null => {
  const tVals: number[] = [];

  if (dx !== 0) {
    tVals.push((left - cx) / dx); // `t` from line equation: 0 = ax + bx*t
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
      if (t < bestT && intersectionVisible(x, y, w, h, left)) {
        best = [x, y];
        bestT = t;
      }
    }
  }

  if (!best) {
    return null;
  }

  return movePoint10pxInside(best, dx, dy);
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

const setArrowPosition = (
  left: number,
  w: number,
  h: number,
  marker: Point,
) => {
  const arrow = document.getElementById('preview-arrow');
  if (!arrow) return;

  const center = { x: left + (w - left) / 2, y: h / 2 };
  const dx = marker.x - center.x;
  const dy = marker.y - center.y;
  const angle = Math.atan2(dy, dx);

  const edge = intersectRect(left, center.x, center.y, dx, dy, w, h);
  if (edge) {
    arrow.style.left = `${edge[0] - 10}px`;
    arrow.style.top = `${edge[1] - 10}px`;
    arrow.style.transform = `rotate(${angle}rad)`;
    arrow.style.display = 'block';
  } else {
    arrow.style.display = 'none';
  }
};

let previewMarker: maplibregl.Marker;

export const updateArrowFactory = (map: Map, isPanelOpen: boolean) => () => {
  const arrow = document.getElementById('preview-arrow');
  if (!arrow) return;

  if (!previewMarker || (isMobileModeVanilla() && isPanelOpen)) {
    arrow.style.display = 'none';
    return;
  }

  const leftOffset = isPanelOpen ? FEATURE_PANEL_WIDTH : 0;

  const canvas = map.getCanvas();
  const w = canvas.width;
  const h = canvas.height;
  const marker = map.project(previewMarker.getLngLat());

  if (isInsideBounds(marker, leftOffset, w, h)) {
    arrow.style.display = 'none';
  } else {
    setArrowPosition(leftOffset, w, h, marker);
  }
};

const isPanelOpen = (pathname: string, homepageShown: boolean) =>
  homepageShown || pathname !== '/';

export const usePreviewMarker = (map: Map) => {
  const { preview, homepageShown } = useFeatureContext();
  const { pathname } = useRouter();
  const panelOpen = isPanelOpen(pathname, homepageShown);

  useEffect(() => {
    if (!map) return;
    previewMarker?.remove();
    previewMarker = undefined;

    if (preview?.center) {
      previewMarker = new maplibregl.Marker(PREVIEW_MARKER)
        .setLngLat(preview.center as [number, number])
        .addTo(map);

      const updateArrow = updateArrowFactory(map, panelOpen);
      map.on('move', updateArrow);
      updateArrow();

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
  }, [map, panelOpen, preview?.center]);
};
