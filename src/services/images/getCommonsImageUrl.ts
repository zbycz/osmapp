import { md5 } from 'js-md5';
import { encodeUrl } from '../../helpers/utils';

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
  const fileName = photoName.replace(/^File:/, '').replace(/ /g, '_');
  const hash = md5(fileName);
  const part1 = hash[0];
  const part2 = hash.substring(0, 2);
  return encodeUrl`https://upload.wikimedia.org/wikipedia/commons/thumb/${part1}/${part2}/${fileName}/${width}px-${fileName}`;
};
