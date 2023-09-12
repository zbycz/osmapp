export type PointType = 'anchor' | 'bolt-hanger' | 'bolt' | 'piton';

export type PathPoints = Array<{
  x: number;
  y: number;
  type?: PointType;
  note?: string;
}>;
