import { md5 } from 'js-md5';
import { encodeUrl } from '../../helpers/utils';

/** Standard Wikimedia Commons thumbnail widths (https://www.mediawiki.org/wiki/Common_thumbnail_sizes) */
const ALLOWED_WIDTHS = [120, 150, 180, 200, 220, 250, 300, 400] as const;

const MAX_ALLOWED_WIDTH = 400;

/** Returns smallest allowed width >= requested, or null if full resolution needed (> 400px) */
export const roundUpToAllowedWidth = (width: number): number | null => {
  if (width > MAX_ALLOWED_WIDTH) return null;
  const match = ALLOWED_WIDTHS.find((w) => w >= width);
  return match ?? null;
};

export const getCommonsImageUrl = (
  photoName: string,
  width: number,
): string | null => {
  if (!photoName) return null;
  if (!photoName.startsWith('File:')) {
    // eslint-disable-next-line no-console
    console.warn('Invalid Commons photo name without "File:":', photoName);
    return null;
  }
  const fileName = decodeURI(photoName)
    .replace(/^.*File:/, '')
    .replace(/ /g, '_');
  const hash = md5(fileName);
  const part1 = hash[0];
  const part2 = hash.substring(0, 2);

  const thumbnailWidth = roundUpToAllowedWidth(width);

  if (thumbnailWidth === null) {
    return encodeUrl`https://upload.wikimedia.org/wikipedia/commons/${part1}/${part2}/${fileName}`;
  }

  return encodeUrl`https://upload.wikimedia.org/wikipedia/commons/thumb/${part1}/${part2}/${fileName}/${thumbnailWidth}px-${fileName}`;
};
