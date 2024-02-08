import { gradeSystem } from './utils/gradeData';

export type PointType = 'anchor' | 'bolt' | 'piton' | 'sling';

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

export type RouteDifficulty = {
  gradeSystem: GradeSystem;
  grade: string;
};

export type ClimbingRoute = {
  id: string;
  difficulty?: RouteDifficulty; // RouteDifficulty[]
  length?: string;
  author?: string;
  name?: string;
  description?: string;
  paths: { [photoUrl: string]: PathPoints };
};

export type ZoomState = {
  scale: number;
  positionX: number;
  positionY: number;
};

export type GradeTable = Array<Array<string>>;
export type GradeSystem = typeof gradeSystem[number]['key'];
