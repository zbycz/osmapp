export type LandmarkView = {
  zoom?: number;
  bearing?: number;
  pitch?: number;
};

export const views: Record<string, LandmarkView> = {
  ////////////
  //// USA ///
  ////////////
  // Statue of liberty
  w32965412: { bearing: 330, pitch: 60, zoom: 18.5 },
  // White House
  w238241022: { bearing: 0, pitch: 60, zoom: 18 },
  // Lincoln Memorial
  w398769543: { bearing: 270, pitch: 60, zoom: 18.75 },
  // United States Capitol
  w66418809: { bearing: 270, pitch: 60, zoom: 17.5 },
  ////////////////
  //// GERMANY ///
  ////////////////
  // Elbe Philharmonic Hall
  w24981343: { bearing: 45, pitch: 50, zoom: 17.25 },
  // Cologne Cathedral
  w4532022: { bearing: 90, pitch: 55, zoom: 17.1 },
  // Brandenburg gate
  w518071791: { bearing: 263, pitch: 60, zoom: 19 },
  // Reichstags Building
  r2201742: { bearing: 90, pitch: 55, zoom: 17.5 },
  // Soviet War Memorial Tiergarten
  w41368167: { bearing: 353, pitch: 60, zoom: 19 },
  // Siegessäule
  n1097191894: { pitch: 45, zoom: 18.5 },
  // Berlin Cathedral
  w313670734: { bearing: 22, pitch: 55, zoom: 17.75 },
  ///////////
  // Italy //
  ///////////
  // Colosseum
  r1834818: { bearing: 70, pitch: 50, zoom: 17.5 },
  ////////////
  // France //
  ////////////
  // Eiffel Tower
  w5013364: { bearing: 315, pitch: 15, zoom: 17.5 },
};
