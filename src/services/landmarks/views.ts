export type LandmarkView = {
  zoom?: number;
  bearing?: number;
  pitch?: number;
};

export const views: Record<string, LandmarkView> = {
  // Brandenburg gate
  w518071791: { bearing: 263, pitch: 55, zoom: 19 },
};
