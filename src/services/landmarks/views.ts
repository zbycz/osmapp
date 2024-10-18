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
  // Space needle
  w12903132: { pitch: 30, zoom: 17.25 },

  ////////////////
  //// GERMANY ///
  ////////////////
  // Elbe Philharmonic Hall
  w24981342: { bearing: 45, pitch: 50, zoom: 17.25 },
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
  // Alte Oper Frankfurt
  w384153099: { bearing: 20, pitch: 55, zoom: 18 },

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

  ////////////////////
  // United Kingdom //
  ////////////////////
  // Big Ben & Elizabeth tower
  n1802652184: { bearing: 225, pitch: 50, zoom: 17.5 },
  w123557148: { bearing: 225, pitch: 50, zoom: 17.5 },
  // Buckingham palace
  r5208404: { bearing: 235, pitch: 60, zoom: 17.6 },

  ////////////////////
  // Czech republic //
  ////////////////////
  // Prague Castle
  r3312247: { bearing: 51, pitch: 60, zoom: 16.5 },
  // National museum
  r85291: { bearing: 140, pitch: 50, zoom: 18 },

  /////////////
  // Iceland //
  /////////////
  // Hallgrímskirkja
  r6184378: { bearing: 150, pitch: 40, zoom: 18 },

  ///////////
  // India //
  ///////////
  // Taj Mahal
  w375257537: { bearing: 0, pitch: 50, zoom: 18 },
};
