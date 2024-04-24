import { gradeSystem } from './utils/gradeData';
import { Feature } from '../../../services/types';

export type PointType = 'anchor' | 'bolt' | 'piton' | 'sling' | 'unfinished';

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

export type PathPoint = Position & {
  type?: PointType;
  note?: string;
};
export type PathPoints = Array<PathPoint>;

export type RouteDifficulty = {
  gradeSystem: GradeSystem;
  grade: string;
  gradeMin?: string;
  gradeMax?: string;
};

export type ClimbingRoute = {
  id: string;
  difficulty?: RouteDifficulty; // @TODO RouteDifficulty[]
  length?: string;
  author?: string;
  name?: string;
  description?: string;
  paths: { [photoUrl: string]: PathPoints };
  feature?: Feature;
  photoToKeyMap?: Record<string, string>;
};

export type ZoomState = {
  scale: number;
  positionX: number;
  positionY: number;
};

export type GradeSystem = typeof gradeSystem[number]['key'];
export type GradeTable = Record<GradeSystem, Array<string>>;

export type TickStyle =
  | 'OS'
  | 'FL'
  | 'RP'
  | 'PP'
  | 'RK'
  | 'AF'
  | 'TR'
  | 'FS'
  | null;
export type Tick = {
  osmId: string;
  style: TickStyle;
  date: string;
};
