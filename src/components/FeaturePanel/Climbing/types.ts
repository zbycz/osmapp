export type PointType = 'belay' | 'bolt' | 'piton';

export type Position = {
  x: number;
  y: number;
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
