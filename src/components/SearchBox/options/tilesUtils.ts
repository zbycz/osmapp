import { TilesOption } from '../types';

const tileRegex = /^(\d+)\/(\d+)\/(\d+)$/;

const parseTileFromUrl = (
  input: string,
): { z: number; x: number; y: number } | null => {
  try {
    const url = new URL(input);
    const z = url.searchParams.get('z');
    const x = url.searchParams.get('x');
    const y = url.searchParams.get('y');
    if (z === null || x === null || y === null) return null;
    if (!/^\d+$/.test(z) || !/^\d+$/.test(x) || !/^\d+$/.test(y)) return null;
    return { z: parseInt(z, 10), x: parseInt(x, 10), y: parseInt(y, 10) };
  } catch {
    return null;
  }
};

const isValidTile = (z: number, x: number, y: number): boolean => {
  if (z < 0 || z > 25) return false;
  if (x < 0 || x >= Math.pow(2, z)) return false;
  if (y < 0 || y >= Math.pow(2, z)) return false;
  return true;
};

export const getTilesOption = (inputValue: string): TilesOption[] => {
  const trimmed = inputValue.trim();

  const match = trimmed.match(tileRegex);
  if (match) {
    const z = parseInt(match[1], 10);
    const x = parseInt(match[2], 10);
    const y = parseInt(match[3], 10);
    if (!isValidTile(z, x, y)) return [];
    return [{ type: 'tiles', tiles: { z, x, y, label: `${z}/${x}/${y}` } }];
  }

  const fromUrl = parseTileFromUrl(trimmed);
  if (fromUrl) {
    const { z, x, y } = fromUrl;
    if (!isValidTile(z, x, y)) return [];
    return [{ type: 'tiles', tiles: { z, x, y, label: `${z}/${x}/${y}` } }];
  }

  return [];
};
