import { outdoorStyle } from '../../../../../Map/styles/outdoorStyle';

const apiKey = process.env.NEXT_PUBLIC_API_KEY_MAPTILER;

export const getMapStyle = (mapStyle) => {
  if (mapStyle === 'satellite') {
    return `https://api.maptiler.com/maps/hybrid/style.json?key=${apiKey}`;
  }
  return outdoorStyle;
};
