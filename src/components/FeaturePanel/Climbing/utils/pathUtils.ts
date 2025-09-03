import { boltCodeMap, invertedBoltCodeMap } from './boltCodes';
import { PathPoint, PathPoints, PointType } from '../types';

type BoltCodeMap = Record<string, PointType>;
type InvertedBoltCodeMap = Record<PointType, string>;

const B2T = boltCodeMap as BoltCodeMap;
const T2B = invertedBoltCodeMap as InvertedBoltCodeMap;

const hasTrailingColon = (s: string) => s.includes(':');

const stripTrailingColon = (s: string) =>
  hasTrailingColon(s) ? s.slice(0, -1) : s;

const encodePoint = ({
  x,
  y,
  type,
}: {
  x: number;
  y: number;
  type?: PointType;
}) => `${x},${y}${type ? T2B[type] : ''}`;

const decodePointToken = (token: string): PathPoint => {
  const [xStr, yWithMaybeCode = ''] = token.split(',', 2);

  let type: PointType | undefined;
  let yStr = yWithMaybeCode;
  const last = yStr.slice(-1);

  if (last && B2T[last]) {
    type = B2T[last];
    yStr = yStr.slice(0, -1);
  }

  return {
    x: parseFloat(xStr),
    y: parseFloat(yStr),
    units: 'percentage',
    type,
  };
};

const isFinitePoint = (p: PathPoint) =>
  Number.isFinite(p.x) && Number.isFinite(p.y);

const toSegments = (s: string) => s.split('|').filter(Boolean);

const parsePointFromSegment = (segment: string): PathPoint =>
  decodePointToken(stripTrailingColon(segment));

const applyLineTypes =
  (segments: string[]) =>
  (points: PathPoints): PathPoints =>
    points.map((p, i) =>
      i === 0
        ? p
        : {
            ...p,
            previousLineType: hasTrailingColon(segments[i - 1])
              ? 'dotted'
              : 'solid',
          },
    );

export const stringifyPath = (path: PathPoints): string | undefined => {
  if (!path || path.length === 0) return undefined;

  const head = encodePoint(path[0]);
  const tail = path
    .slice(1)
    .map((p) => (p.previousLineType === 'dotted' ? ':|' : '|') + encodePoint(p))
    .join('');

  return head + tail;
};

export const parsePathString = (pathString?: string): PathPoints => {
  if (!pathString) return [];

  const segments = toSegments(pathString);
  if (segments.length === 0) return [];

  const points = segments.map(parsePointFromSegment);
  const withLineTypes = applyLineTypes(segments)(points);

  return withLineTypes.filter(isFinitePoint);
};
