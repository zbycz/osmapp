export type PointType = 'belay' | 'bolt' | 'piton';

export type Position = {
  x: number;
  y: number;
  units: 'percentage';
};
export type PositionPx = {
  x: number;
  y: number;
  units: 'px';
};

export type Size = {
  width: number;
  height: number;
};

export type PathPoints = Array<
  Position & {
    type?: PointType;
    note?: string;
  }
>;

export type ClimbingRoute = {
  difficulty?: string;
  length?: string;
  name?: string;
  description?: string;
  path: PathPoints;
};

// images: Array<Array<ClimbingRoute>>
