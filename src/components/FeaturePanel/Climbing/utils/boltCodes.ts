import { invert } from 'lodash';
import { PointType } from '../types';

export const boltCodeMap: Record<string, PointType> = {
  B: 'bolt',
  A: 'anchor',
  P: 'piton',
  S: 'sling',
  U: 'unfinished',
};

export const invertedBoltCodeMap = invert(boltCodeMap);
