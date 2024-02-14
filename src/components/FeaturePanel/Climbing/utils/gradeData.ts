export const gradeSystem = [
  { key: 'uiaa', name: 'UIAA (recommended)' },
  { key: 'uktech', name: 'UK tech' },
  { key: 'ukaajd', name: 'UKA adj' },
  { key: 'fb', name: 'French British' },
  { key: 'french', name: 'French' },
  { key: 'saxon', name: 'Saxon' },
  { key: 'nordic', name: 'Nordic' },
  { key: 'yds', name: 'YDS' },
  { key: 'vgrade', name: 'V grade' },
  { key: 'wi', name: 'WI' },
  { key: 'mixed', name: 'Mixed' },
];

export const gradeTableString = `UIAA|Germany, UK Tech, UK ADJ, FB|French British, French, Saxon|Swiss, Nordic|Scandinavian, YDS|YDS_class, V Grade, WI, Mixed
"System used by the International Climbing and Mountaineering Federation.", "The British grading system for traditional climbs.", "The Adjectival English Scale or the overall assessment scale.", "Sport climbing in Britain and Ireland uses the French grading system.", "The French numerical system rates a climb according to the overall technical difficulty and strenuousness of the route.", "The Saxon grading system was developed in the beginning of the 20th century for the formidable Saxon Switzerland climbing region.", "The Nordic grading system.", "The Yosemite Decimal System of grading routes of hikes and climbs developed for the Sierra Nevada range.", "V scale grading system, created by John Sherman, which is the most widely used system in North America.", "Waterfall ice rating system as used in the Canadian Rockies.", "Mixed climbing has its own grading scale that roughly follows the WI rating system."
1-,      1,     M,      1,       1,      I,         1,       5,      VB-,     WI2,   M2
1,       1,     M,      1,       1,      I,         1,       5,      VB-,     WI2,   M2
1+,      1,     M,      1,       1,      I,         1,       5,      VB-,     WI2,   M2
2-,      2,     M/D,    1,       2,      II,        1,       5.1,    VB-,     WI2,   M2
2,       2,     M/D,    1,       2,      II,        1,       5.1,    VB-,     WI2,   M2
2+,      2,     M/D,    1,       2,      II,        1,       5.2,    VB-,     WI2,   M2
3-,      3,     D,      1/2,     3,      III,       1/2,     5.2,    VB-,     WI2,   M2
3,       3,     D,      1/2,     3,      III,       1/2,     5.3,    VB-,     WI3,   M3
3+,      3,     D,      1/2,     3,      III,       1/2,     5.3,    VB-,     WI3,   M3
4-,      4a,    D/VD,   2,       4,      IV,        2,       5.4,    VB-,     WI3,   M3
4,       4a,    D/VD,   2,       4,      IV,        2,       5.5,    VB-,     WI3,   M3
4+,      4a,    VD,     2,       4+,     IV/V,      2,       5.6,    VB-,     WI3,   M3
5-,      4a/4b, S,      2/3,     5a,     V,         2/3,     5.7,    VB-/VB,  WI3,   M3
5,       4b,    HS,     3,       5a/5b,  VI,        3,       5.8,    VB,      WI4,   M4
5+,      4c,    HS/VS,  4a,      5b,     VI/VIIa,   4a,      5.9,    VB/V0-,  WI5,   M5
6-,      4c/5a, VS,     4a/4b,   5b/5c,  VIIa,      4a/4b,   5.10a,  V0-,     WI6,   M6
6,       5a,    HVS,    4b,      5c,     VIIb,      4b,      5.10b,  V0-/V0,  WI6,   M6
6+,      5a/5b, E1,     4c,      6a,     VIIc,      4c,      5.10c,  V0,      WI6,   M6
6+/7-,   5a/5b, E1,     4c,      6a,     VIIc,      4c,      5.10c,  V0,      WI6,   M6
7-,      5b,    E1/E2,  5a,      6a+,    VIIIa,     5a,      5.10d,  V0+,     WI6,   M6
8-/7,    5a/5b, E1,     4c,      6a,     VIIc,      4c,      5.10c,  V0,      WI6,   M6
7,       5b/5c, E2,     5b,      6b,     VIIIb,     5b,      5.11a,  V1,      WI7,   M7
7/7+,    5b/5c, E2,     5b,      6b,     VIIIb,     5b,      5.11a,  V1,      WI7,   M7
7+,      5c,    E2/E3,  5c,      6b+,    VIIIc,     5c,      5.11b,  V1/V2,   WI7,   M7
7+/8-,   5c,    E2/E3,  5c,      6b+,    VIIIc,     5c,      5.11b,  V1/V2,   WI7,   M7
8-,      5c/6a, E3,     6a,      6c,     IXa,       6a,      5.11c,  V2,      WI8,   M8
8-/8,    5c/6a, E3,     6a,      6c,     IXa,       6a,      5.11c,  V2,      WI8,   M8
8,       6a,    E4,     6b,      7a,     IXb,       6b,      5.11d,  V3,      WI8,   M8
8/8+,    6a,    E4,     6b,      7a,     IXb,       6b,      5.11d,  V3,      WI8,   M8
8+,      6a,    E4/E5,  6b+,     7a+,    IXc,       6b+,     5.12a,  V3/V4,   WI8,   M8
8+/9-,   6a,    E4/E5,  6b+,     7a+,    IXc,       6b+,     5.12a,  V3/V4,   WI8,   M8
9-,      6b,    E5,     6c,      7b+,    Xa,        6c,      5.12b,  V4,      WI8,   M8
9-/9,    6b,    E5,     6c,      7b+,    Xa,        6c,      5.12b,  V4,      WI8,   M8
9,       6b/6c, E6,     6c+,     7c,     Xb,        6c+,     5.12c,  V4/V5,   WI9,   M9
9/9+,    6b/6c, E6,     6c+,     7c,     Xb,        6c+,     5.12c,  V4/V5,   WI9,   M9
9+,      6c,    E6/E7,  7a,      7c+,    Xc,        7a,      5.12d,  V5,      WI9,   M9
9+/10-,  6c,    E6/E7,  7a,      7c+,    Xc,        7a,      5.12d,  V5,      WI9,   M9
10-,     6c,    E7,     7a+,     8a,     Xc,        7a+,     5.13a,  V6,      WI9,   M9
10-/10,  6c,    E7,     7a+,     8a,     Xc,        7a+,     5.13a,  V6,      WI9,   M9
10,      6c/7a, E7/E8,  7a+/7b,  8a/8a+, Xc/XIa,    7a+/7b,  5.13b,  V6/V7,   WI9,   M9
10/10+,  6c/7a, E7/E8,  7a+/7b,  8a/8a+, Xc/XIa,    7a+/7b,  5.13b,  V6/V7,   WI9,   M9
10+,     7a,    E8,     7b,      8a+,    XIa,       7b,      5.13c,  V7,      WI10,  M10
10+/11-, 7a,    E8,     7b,      8a+,    XIa,       7b,      5.13c,  V7,      WI10,  M10
11-,     7a,    E9,     7b+,     8b,     XIb,       7b+,     5.13d,  V8,      WI10,  M10
11-/11,  7a,    E9,     7b+,     8b,     XIb,       7b+,     5.13d,  V8,      WI10,  M10
11,      7a/7b, E9/E10, 7c,      8b+,    XIc,       7c,      5.14a,  V9,      WI10,  M10
11/11+,  7a/7b, E9/E10, 7c,      8b+,    XIc,       7c,      5.14a,  V9,      WI10,  M10
11+,     7b,    E10,    7c+,     8c,     XIc/XIIa,  7c+,     5.14b,  V10,     WI10,  M10
11+/12-, 7b,    E10,    7c+,     8c,     XIc/XIIa,  7c+,     5.14b,  V10,     WI10,  M10
12-,     7b,    E11,    7c+/8a,  8c+,    XIIa,      7c+/8a,  5.14c,  V10/V11, WI11,  M11
12-/12,  7b,    E11,    7c+/8a,  8c+,    XIIa,      7c+/8a,  5.14c,  V10/V11, WI11,  M11
12,      7b,    E11,    8a,      9a,     XIIb,      8a,      5.14d,  V11,     WI11,  M11
12/12+,  7b,    E11,    8a,      9a,     XIIb,      8a,      5.14d,  V11,     WI11,  M11
12+,     >7b,   >E11,   8a+/8b,  9a+,    XIIb/XIIc, 8a+/8b,  5.15a,  V12,     WI11,  M11
12+/13-, >7b,   >E11,   8a+/8b,  9a+,    XIIb/XIIc, 8a+/8b,  5.15a,  V12,     WI11,  M11
13-,     >7b,   >E11,   8b,      9a+/9b, XIIc,      8b,      5.15a,  V13,     WI11,  M11
13-/13,  >7b,   >E11,   8b,      9a+/9b, XIIc,      8b,      5.15a,  V13,     WI11,  M11
13,      >7b,   >E11,   8b+,     9b,     XIIc,      8b+,     5.15b,  V14,     WI12,  M12
13/13+,  >7b,   >E11,   8b+,     9b,     XIIc,      8b+,     5.15b,  V14,     WI12,  M12
13+,     >7b,   >E11,   8c,      9b+,    >XIIc,     8c,      5.15c,  V15,     WI13,  M13
13+/14-, >7b,   >E11,   8c,      9b+,    >XIIc,     8c,      5.15c,  V15,     WI13,  M13
14-,     >7b,   >E11,   8c+,     9c,     >XIIc,     8c+,     5.15d,  V15,     WI13,  M13`;

export const gradeColors = {
  '1-': '#048F28',
  '1': '#048F28',
  '1+': '#048F28',
  '2-': '#048F28',
  '2': '#048F28',
  '2+': '#048F28',
  '3-': '#048F28',
  '3': '#048F28',
  '3+': '#048F28',
  '4-': '#6B9617',
  '4': '#6B9617',
  '4+': '#6B9617',
  '5-': '#6B9617',
  '5': '#6B9617',
  '5+': '#6B9617',
  '6-': '#D49D05',
  '6': '#D49D05',
  '6+': '#D49D05',
  '6+/7-': '#D49D05',
  '7-': '#D49D05',
  '7-/7': '#D49D05',
  '7': '#D49D05',
  '7/7+': '#D49D05',
  '7+': '#D49D05',
  '7+/8-': '#D49D05',
  '8-': '#C24801',
  '8-/8': '#C24801',
  '8': '#C24801',
  '8/8+': '#C24801',
  '8+': '#C24801',
  '8+/9-': '#C24801',
  '9-': '#C24801',
  '9-/9': '#C24801',
  '9': '#C24801',
  '9/9+': '#C24801',
  '9+': '#C24801',
  '9+/10-': '#C24801',
  '10-': '#9C0101',
  '10-/10': '#9C0101',
  '10': '#9C0101',
  '10/10+': '#9C0101',
  '10+': '#9C0101',
  '10+/11-': '#9C0101',
  '11-': '#9C0101',
  '11-/11': '#9C0101',
  '11': '#9C0101',
  '11/11+': '#9C0101',
  '11+': '#9C0101',
  '11+/12-': '#9C0101',
  '12-': '#9C0101',
  '12-/12': '#9C0101',
  '12': '#9C0101',
  '12/12+': '#9C0101',
  '12+': '#9C0101',
  '12+/13-': '#9C0101',
  '13-': '#9C0101',
  '13-/13': '#9C0101',
  '13': '#9C0101',
  '13/13+': '#9C0101',
  '13+': '#9C0101',
  '13+/14-': '#9C0101',
  '14-': '#9C0101',
};
