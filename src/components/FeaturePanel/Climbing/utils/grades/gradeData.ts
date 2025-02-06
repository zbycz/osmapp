import {
  GRADE_SYSTEMS,
  GradeSystem,
} from '../../../../../services/tagging/climbing';

type GradeTable = Record<GradeSystem, Array<string>>;

// The order of the GRADE_SYSTEMS array must be the same as CSV below !!

// Source of this table is: https://wiki.openstreetmap.org/wiki/Climbing#Grading
// UIAA                 French/British                 Nordic                    WI
//       UK Tech                 French                         YDS|YDS_class           Mixed
//              UK ADJ                   Saxon                    V Grade
export const gradeTableString = `UIAA|Germany, UK Tech, UK ADJ, FB|French British, French, Saxon|Swiss, Nordic|Scandinavian, YDS|YDS_class, V Grade, WI, Mixed
1-,      1,     M,      1,       1,      I,            1,       5,      VB-,     WI2,   M2
1,       1,     M,      1,       1,      I,            1,       5,      VB-,     WI2,   M2
1+,      1,     M,      1,       1,      I,            1,       5,      VB-,     WI2,   M2
2-,      2,     M/D,    1,       2,      II,           1,       5.1,    VB-,     WI2,   M2
2,       2,     M/D,    1,       2,      II,           1,       5.1,    VB-,     WI2,   M2
2+,      2,     M/D,    1,       2,      II,           1,       5.2,    VB-,     WI2,   M2
3-,      3,     D,      1/2,     3-,     III,          1/2,     5.2,    VB-,     WI2,   M2
3,       3,     D,      1/2,     3,      III,          1/2,     5.3,    VB-,     WI3,   M3
3+,      3,     D,      1/2,     3+,     III,          1/2,     5.3,    VB-,     WI3,   M3
4-,      4a,    D/VD,   2,       4a,     IV,           2,       5.4,    VB-,     WI3,   M3
4,       4a,    D/VD,   2,       4b,     IV,           2,       5.5,    VB-,     WI3,   M3
4+,      4a,    VD,     2,       4c,     V,            2,       5.6,    VB-,     WI3,   M3
5-,      4a/4b, S,      2/3,     4c,     V,            2/3,     5.7,    VB-/VB,  WI3,   M3
5,       4b,    HS,     3,       5a,     VI,           3,       5.8,    VB,      WI4,   M4
5+,      4c,    HS/VS,  4a,      5a,     VI,           4a,      5.9,    VB/V0-,  WI5,   M5
6-,      4c/5a, VS,     4a/4b,   5b,     VIIa,         4a/4b,   5.10a,  V0-,     WI6,   M6
6,       5a,    HVS,    4b,      5c,     VIIb,         4b,      5.10b,  V0-/V0,  WI6,   M6
6,       5a,    HVS,    4b,      5c,     VII,          4b,      5.10b,  V0-/V0,  WI6,   M6
6+,      5a/5b, E1,     4c,      5c+,     VIIc,         4c,      5.10c,  V0,      WI6,   M6
6+/7-,   5a/5b, E1,     4c,      6a,     VIIc/VIIIa,   4c,      5.10c,  V0,      WI6,   M6
7-,      5b,    E1/E2,  5a,      6a+,    VIIIa,        5a,      5.10d,  V0+,     WI6,   M6
7-/7,    5a/5b, E1,     4c,      6a+/6b, VIIIa/VIIIb,  4c,      5.10c,  V0,      WI6,   M6
7,       5b/5c, E2,     5b,      6b,     VIIIb,        5b,      5.11a,  V1,      WI7,   M7
7/7+,    5b/5c, E2,     5b,      6b/6b+, VIIIb/VIIIc,  5b,      5.11a,  V1,      WI7,   M7
7+,      5c,    E2/E3,  5c,      6b+,    VIIIc,        5c,      5.11b,  V1/V2,   WI7,   M7
7+/8-,   5c,    E2/E3,  5c,      6c,     VIIIc/IXa,    5c,      5.11b,  V1/V2,   WI7,   M7
8-,      5c/6a, E3,     6a,      6c/6c+, VIIIc/IXa,    6a,      5.11c,  V2,      WI8,   M8
8-,      5c/6a, E3,     6a,      6c+,    IXa,          6a,      5.11c,  V2,      WI8,   M8
8-/8,    5c/6a, E3,     6a,      6c+/7a, IXa/IXb,      6a,      5.11c,  V2,      WI8,   M8
8,       6a,    E4,     6b,      7a,     IXb,          6b,      5.11d,  V3,      WI8,   M8
8/8+,    6a,    E4,     6b,      7a/7a+, IXb/IXc,      6b,      5.11d,  V3,      WI8,   M8
8+,      6a,    E4/E5,  6b+,     7a+,    IXc,          6b+,     5.12a,  V3/V4,   WI8,   M8
8+/9-,   6a,    E4/E5,  6b+,     7b,     IXc/Xa,       6b+,     5.12a,  V3/V4,   WI8,   M8
9-,      6b,    E5,     6c,      7b/7b+, IXc/Xa,       6c,      5.12b,  V4,      WI8,   M8
9-,      6b,    E5,     6c,      7b+,    Xa,           6c,      5.12b,  V4,      WI8,   M8
9-/9,    6b,    E5,     6c,      7b+/7c, Xa/Xb,        6c,      5.12b,  V4,      WI8,   M8
9,       6b/6c, E6,     6c+,     7c,     Xb,           6c+,     5.12c,  V4/V5,   WI9,   M9
9/9+,    6b/6c, E6,     6c+,     7c/7c+, Xb/Xc,        6c+,     5.12c,  V4/V5,   WI9,   M9
9+,      6c,    E6/E7,  7a,      7c+,    Xc,           7a,      5.12d,  V5,      WI9,   M9
9+/10-,  6c,    E6/E7,  7a,      8a,     Xc/XIa,       7a,      5.12d,  V5,      WI9,   M9
10-,     6c,    E7,     7a+,     8a/8a+, Xc/XIa,       7a+,     5.13a,  V6,      WI9,   M9
10-,     6c,    E7,     7a+,     8a+,    XIa,          7a+,     5.13a,  V6,      WI9,   M9
10-/10,  6c,    E7,     7a+,     8a+/8b, XIa/XIb,      7a+,     5.13a,  V6,      WI9,   M9
10,      6c/7a, E7/E8,  7a+/7b,  8b,     XIb,          7a+/7b,  5.13b,  V6/V7,   WI9,   M9
10/10+,  6c/7a, E7/E8,  7a+/7b,  8a/8a+, XIb/XIc,      7a+/7b,  5.13b,  V6/V7,   WI9,   M9
10+,     7a,    E8,     7b,      8b+,    XIc,          7b,      5.13c,  V7,      WI10,  M10
10+/11-, 7a,    E8,     7b,      8b+/8c, XIc/XIIa,     7b,      5.13c,  V7,      WI10,  M10
11-,     7a,    E9,     7b+,     8c,     XIIa,         7b+,     5.13d,  V8,      WI10,  M10
11-,     7a,    E9,     7b+,     8c/8c+, XIIa,         7b+,     5.13d,  V8,      WI10,  M10
11-/11,  7a,    E9,     7b+,     8c+,    XIIa/XIIb,    7b+,     5.13d,  V8,      WI10,  M10
11-/11,  7a,    E9,     7b+,     8c+/9a, XIIa/XIIb,    7b+,     5.13d,  V8,      WI10,  M10
11,      7a/7b, E9/E10, 7c,      9a,     XIIb,         7c,      5.14a,  V9,      WI10,  M10
11/11+,  7a/7b, E9/E10, 7c,      9a/9a+, XIIb/XIIc,    7c,      5.14a,  V9,      WI10,  M10
11+,     7b,    E10,    7c+,     9a+,    XIIc,         7c+,     5.14b,  V10,     WI10,  M10
11+,     7b,    E10,    7c+,     9a+/9b, XIIc/XIIIa,   7c+,     5.14b,  V10,     WI10,  M10
11+/12-, 7b,    E10,    7c+,     9b,     XIIIa,        7c+,     5.14b,  V10,     WI10,  M10
11+/12-, 7b,    E10,    7c+,     9b/9b+, XIIIa/XIIIb,  7c+,     5.14b,  V10,     WI10,  M10
12-,     7b,    E11,    7c+/8a,  9b+,    XIIIb,        7c+/8a,  5.14c,  V10/V11, WI11,  M11
12-/12,  7b,    E11,    7c+/8a,  9b+/9c, XIIIb/XIIIc,  7c+/8a,  5.14c,  V10/V11, WI11,  M11
12,      7b,    E11,    8a,      9c,     XIIIc,        8a,      5.14d,  V11,     WI11,  M11
12/12+,  7b,    E11,    8a,      9c/9c+, XIIIc,        8a,      5.14d,  V11,     WI11,  M11
12+,     >7b,   >E11,   8a+/8b,  9c+,    XIIIc,        8a+/8b,  5.15a,  V12,     WI11,  M11
12+/13-, >7b,   >E11,   8a+/8b,  10a,    >XIIIc,       8a+/8b,  5.15a,  V12,     WI11,  M11
13-,     >7b,   >E11,   8b,      >10a,   >XIIIc,       8b,      5.15a,  V13,     WI11,  M11
13-/13,  >7b,   >E11,   8b,      >10a,   >XIIIc,       8b,      5.15a,  V13,     WI11,  M11
13,      >7b,   >E11,   8b+,     >10a,   >XIIIc,       8b+,     5.15b,  V14,     WI12,  M12
13/13+,  >7b,   >E11,   8b+,     >10a,   >XIIIc,       8b+,     5.15b,  V14,     WI12,  M12
13+,     >7b,   >E11,   8c,      >10a,   >XIIIc,       8c,      5.15c,  V15,     WI13,  M13
13+/14-, >7b,   >E11,   8c,      >10a,   >XIIIc,       8c,      5.15c,  V15,     WI13,  M13
14-,     >7b,   >E11,   8c+,     >10a,   >XIIIc,       8c+,     5.15d,  V15,     WI13,  M13`;

export const gradeColors = {
  '1-': { light: '#048F28', dark: '#00c132' },
  '1': { light: '#048F28', dark: '#00c132' },
  '1+': { light: '#048F28', dark: '#00c132' },
  '2-': { light: '#048F28', dark: '#00c132' },
  '2': { light: '#048F28', dark: '#00c132' },
  '2+': { light: '#048F28', dark: '#00c132' },
  '3-': { light: '#048F28', dark: '#00c132' },
  '3': { light: '#048F28', dark: '#00c132' },
  '3+': { light: '#048F28', dark: '#00c132' },
  '4-': { light: '#6B9617', dark: '#92af00' },
  '4': { light: '#6B9617', dark: '#92af00' },
  '4+': { light: '#6B9617', dark: '#92af00' },
  '5-': { light: '#6B9617', dark: '#92af00' },
  '5': { light: '#6B9617', dark: '#92af00' },
  '5+': { light: '#6B9617', dark: '#92af00' },
  '6-': { light: '#D49D05', dark: '#efca00' },
  '6': { light: '#D49D05', dark: '#efca00' },
  '6+': { light: '#D49D05', dark: '#efca00' },
  '6+/7-': { light: '#D49D05', dark: '#efca00' },
  '7-': { light: '#D49D05', dark: '#efca00' },
  '7-/7': { light: '#D49D05', dark: '#efca00' },
  '7': { light: '#D49D05', dark: '#efca00' },
  '7/7+': { light: '#D49D05', dark: '#efca00' },
  '7+': { light: '#D49D05', dark: '#efca00' },
  '7+/8-': { light: '#D49D05', dark: '#efca00' },
  '8-': { light: '#C24801', dark: '#d94f00' },
  '8-/8': { light: '#C24801', dark: '#d94f00' },
  '8': { light: '#C24801', dark: '#d94f00' },
  '8/8+': { light: '#C24801', dark: '#d94f00' },
  '8+': { light: '#C24801', dark: '#d94f00' },
  '8+/9-': { light: '#C24801', dark: '#d94f00' },
  '9-': { light: '#C24801', dark: '#d94f00' },
  '9-/9': { light: '#C24801', dark: '#d94f00' },
  '9': { light: '#C24801', dark: '#d94f00' },
  '9/9+': { light: '#C24801', dark: '#d94f00' },
  '9+': { light: '#C24801', dark: '#d94f00' },
  '9+/10-': { light: '#C24801', dark: '#d94f00' },
  '10-': { light: '#9C0101', dark: '#690000' },
  '10-/10': { light: '#9C0101', dark: '#690000' },
  '10': { light: '#9C0101', dark: '#690000' },
  '10/10+': { light: '#9C0101', dark: '#690000' },
  '10+': { light: '#9C0101', dark: '#690000' },
  '10+/11-': { light: '#9C0101', dark: '#690000' },
  '11-': { light: '#9C0101', dark: '#690000' },
  '11-/11': { light: '#9C0101', dark: '#690000' },
  '11': { light: '#9C0101', dark: '#690000' },
  '11/11+': { light: '#9C0101', dark: '#690000' },
  '11+': { light: '#9C0101', dark: '#690000' },
  '11+/12-': { light: '#9C0101', dark: '#690000' },
  '12-': { light: '#9C0101', dark: '#690000' },
  '12-/12': { light: '#9C0101', dark: '#690000' },
  '12': { light: '#9C0101', dark: '#690000' },
  '12/12+': { light: '#9C0101', dark: '#690000' },
  '12+': { light: '#9C0101', dark: '#690000' },
  '12+/13-': { light: '#9C0101', dark: '#690000' },
  '13-': { light: '#9C0101', dark: '#690000' },
  '13-/13': { light: '#9C0101', dark: '#690000' },
  '13': { light: '#9C0101', dark: '#690000' },
  '13/13+': { light: '#9C0101', dark: '#690000' },
  '13+': { light: '#9C0101', dark: '#690000' },
  '13+/14-': { light: '#9C0101', dark: '#690000' },
  '14-': { light: '#9C0101', dark: '#690000' },
  '14': { light: '#9C0101', dark: '#690000' },
};

export const csvToArray = (csv: string) => {
  const rows = csv.split('\n');
  const data = rows.slice(1);
  return data.map((dataRow) => {
    const rowDifficulties = dataRow.split(',');
    return rowDifficulties.map((difficulty) => difficulty.trimStart().trim());
  });
};

export const transposeArrays = (t: Array<Array<any>>) =>
  t[0].map((_, colIndex) => t.map((row) => row[colIndex]));

export const getCsvGradeData = (): GradeTable => {
  const transposedTable = transposeArrays(csvToArray(gradeTableString));

  return transposedTable.reduce(
    (acc, row, index) =>
      GRADE_SYSTEMS[index]
        ? {
            ...acc,
            [GRADE_SYSTEMS[index].key]: row,
          }
        : acc,
    {},
  );
};

export const GRADE_TABLE: GradeTable = getCsvGradeData();
