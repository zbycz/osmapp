import { getDifficulty } from '../../../services/tagging/climbing/routeGrade';
import { GRADE_TABLE } from '../../../services/tagging/climbing/gradeData';
import { GeojsonFeature, Lookup, OsmItem } from './types';

export const encodeHistogram = (array: number[] | undefined): string | null => {
  if (!array) {
    return null;
  }
  if (array.length > 255) {
    throw new Error('Index exceeds Uint8 max value (255)');
  }
  if (array.some((v) => v > 255)) {
    throw new Error('Some value exceeds Uint8 max value (255)');
  }

  const entries: [number, number][] = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] > 0) {
      entries.push([i, array[i]]);
    }
  }

  const bufferSize = entries.length * 2;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  let offset = 0;
  for (const [index, value] of entries) {
    view.setUint8(offset, index);
    offset += 1;
    view.setUint8(offset, value);
    offset += 1;
  }

  const nodeBuffer = Buffer.from(buffer);
  return nodeBuffer.toString('base64'); // TODO optimization pack in 6 bits instead of 8 bits
};

const decodeHistogram = (
  base64String: string,
  originalArrayLength: number,
): number[] => {
  const buf = Buffer.from(base64String, 'base64');
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const resultArray: number[] = new Array(originalArrayLength).fill(0);

  let offset = 0;
  while (offset < view.byteLength) {
    const index = view.getUint8(offset);
    offset += 1;
    const value = view.getUint8(offset);
    offset += 1;
    if (index >= originalArrayLength) continue;
    resultArray[index] = value;
  }
  return resultArray;
};

export const getHistogram = <T extends OsmItem>(element: T, lookup: Lookup) => {
  if (element.type === 'relation' && element.tags?.climbing === 'crag') {
    const array = element.members.reduce((acc, { type, ref }) => {
      const route = lookup[type][ref];
      if (!route) return acc;

      const grade = getDifficulty(route.tags);
      if (!grade) return acc;

      const table = GRADE_TABLE[grade.gradeSystem];
      if (!table) return acc;

      const index = table.indexOf(grade.grade);
      acc[index] = (acc[index] ?? 0) + 1;

      return acc;
    }, [] as number[]);

    return array;
  } else {
    return undefined;
  }
};

export const sumMemberHistograms = (
  members: GeojsonFeature['properties'][],
) => {
  const histograms = members.map((member) => member?.histogram).filter(Boolean);

  return histograms.reduce((acc, histogram) => {
    histogram.forEach(
      (value, index) => (acc[index] = (acc[index] ?? 0) + value),
    );
    return acc;
  }, []);
};
