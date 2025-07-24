export type PointProps = {
  x: number;
  y: number;
  isPointSelected: boolean;
  onClick?: (e: any) => void;
  pointerEvents?: string;
  pointIndex: number;
};
