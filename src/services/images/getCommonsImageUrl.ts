import { md5 } from 'js-md5';
import { encodeUrl } from '../../helpers/utils';

// requests for other widths works, but may be blocked for some users #1463
// from https://www.mediawiki.org/wiki/Common_thumbnail_sizes
export type CommonsAllowedWidth =
  | 20
  | 40
  | 60
  | 120
  | 250
  | 330
  | 500
  | 960
  | 1280
  | 1920
  | 3840;

export const getCommonsImageUrl = (
  photoName: string,
  width: CommonsAllowedWidth | 'original',
): string | null => {
  if (!photoName) {
    return null;
  }

  if (!photoName.startsWith('File:')) {
    console.warn('Invalid Commons photo name without "File:":', photoName); // eslint-disable-line no-console
    return null;
  }

  const fileName = decodeURI(photoName)
    .replace(/^.*File:/, '')
    .replace(/ /g, '_');
  const hash = md5(fileName);
  const part1 = hash[0];
  const part2 = hash.substring(0, 2);

  if (width === 'original') {
    return encodeUrl`https://upload.wikimedia.org/wikipedia/commons/${part1}/${part2}/${fileName}`;
  }

  return encodeUrl`https://upload.wikimedia.org/wikipedia/commons/thumb/${part1}/${part2}/${fileName}/${width}px-${fileName}`;
};
