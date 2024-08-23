import type { OsmId, OsmType } from './types';

const LOOKUP: Record<string, OsmType> = { w: 'way', n: 'node', r: 'relation' };

// Letters I, O and l are missing intentionally
const NODE_ABC = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
const OTHER_ABC = 'abcdefghijklmnopqrstuvwxyz';

const numToShortId = (id: number, alphabet: string): string => {
  const max = alphabet.length;
  const out = [];
  let rest = id;
  while (rest >= max) {
    out.push(rest % max);
    rest = Math.floor(rest / max);
  }
  out.push(rest);

  return out
    .reverse()
    .map((idx) => alphabet.charAt(idx))
    .join('');
};

const shortIdToNum = (shortId: string, abc): number => {
  const nums = shortId
    .split('')
    .map((char) => abc.indexOf(char))
    .reverse();

  if (nums.some((num) => num === -1)) {
    return null;
  }

  let out = 0;
  nums.forEach((num, position) => {
    out += num * abc.length ** position;
  });

  return out;
};

/**
 * TYPE     | eg. in 2024    | otherAbc | nodeAbc
 * node     | 11_660_046_031 | 8 chars  | 6 chars
 * way      |    173_514_748 | 6 chars  |  x
 * relation |     17_089_246 | 6 chars  |  x
 */
export const getShortenerSlug = ({ id, type }: OsmId): string | null => {
  if (!['node', 'way', 'relation'].includes(type)) {
    return null;
  }
  const encoded = numToShortId(id, type === 'node' ? NODE_ABC : OTHER_ABC);
  return `${encoded}${type.substring(0, 1)}`;
};

export const getIdFromShortener = (slug: string): OsmId | null => {
  const typeChar = slug.substr(-1, 1);
  const type = LOOKUP[typeChar];
  const encoded = slug.substring(0, slug.length - 1);

  if (!type) {
    return null;
  }

  const decoded =
    type === 'node'
      ? shortIdToNum(
          encoded
            .replaceAll('l', '1')
            .replaceAll('I', '1')
            .replaceAll('O', '0'),
          NODE_ABC,
        )
      : shortIdToNum(encoded, OTHER_ABC);

  if (decoded === null) {
    return null;
  }

  return { type, id: decoded };
};
