import {
  GRADE_SYSTEMS,
  GradeSystem,
} from '../../../../../services/tagging/climbing';

type GradeTable = Record<GradeSystem, Array<string>>;

// The order of the GRADE_SYSTEMS array must be the same as CSV below !!

// Source of this table is: https://wiki.openstreetmap.org/wiki/Climbing#Grading
// UIAA                        YDS                     UK ADJ                    WI
//       French                        V Grade                 FB                       Mixed
//               Saxon                          UK Tech                 Norwegian               Polish
export const gradeTableString = `UIAA|Germany, French, Saxon|Swiss, YDS|YDS_class, V Grade, UK Tech, UK ADJ, FB|French British, Norwegian|Scandinavian, WI, Mixed
1-,      1,      I,            5,      VB-,     1,     M,      1,       1-,       WI2,   M2,     I-
1,       1,      I,            5,      VB-,     1,     M,      1,       1,        WI2,   M2,     I
1+,      1,      I,            5,      VB-,     1,     M,      1,       1+,       WI2,   M2,     I+
2-,      2,      II,           5.1,    VB-,     2,     M/D,    1,       2-,       WI2,   M2,     II-
2,       2,      II,           5.1,    VB-,     2,     M/D,    1,       2,        WI2,   M2,     II
2+,      2,      II,           5.2,    VB-,     2,     M/D,    1,       2+,       WI2,   M2,     II+
3-,      3-,     III,          5.2,    VB-,     3,     D,      1/2,     3-,       WI2,   M2,     III-
3,       3,      III,          5.3,    VB-,     3,     D,      1/2,     3,        WI3,   M3,     III
3+,      3+,     III,          5.3,    VB-,     3,     D,      1/2,     3+,       WI3,   M3,     III+
4-,      4a,     IV,           5.4,    VB-,     4a,    D/VD,   2,       4-,       WI3,   M3,     IV-
4,       4b,     IV,           5.5,    VB-,     4a,    D/VD,   2,       4,        WI3,   M3,     IV
4+,      4c,     V,            5.6,    VB-,     4a,    VD,     2,       4,        WI3,   M3,     IV+
5-,      4c,     V,            5.7,    VB-/VB,  4a/4b, S,      2/3,     4+,       WI3,   M3,     V-
5,       5a,     VI,           5.8,    VB,      4b,    HS,     3,       4+,       WI4,   M4,     V
5+,      5a,     VI,           5.9,    VB/V0-,  4c,    HS/VS,  4a,      5-,       WI5,   M5,     V/V+
5+,      5a,     VI,           5.9,    VB/V0-,  4c,    HS/VS,  4a,      5-,       WI5,   M5,     V+
6-,      5b,     VIIa,         5.10a,  V0-,     4c/5a, VS,     4a/4b,   5/5+,     WI6,   M6,     V+/VI-
6-/6,    5c,     VIIb,         5.10b,  V0-/V0,  5a,    HVS,    4b,      5,        WI6,   M6,     VI-
6,       5c,     VIIb,         5.10b,  V0-/V0,  5a,    HVS,    4b,      5+,       WI6,   M6,     VI-
6/6+,    5c,     VII,          5.10b,  V0-/V0,  5a,    HVS,    4b,      5+/6-,    WI6,   M6,     VI-/VI
6+,      5c+,    VIIc,         5.10c,  V0,      5a/5b, E1,     4c,      6-,       WI6,   M6,     VI
6+/7-,   6a,     VIIc/VIIIa,   5.10c,  V0,      5a/5b, E1,     4c,      6-,       WI6,   M6,     VI/VI+
7-,      6a+,    VIIIa,        5.10d,  V0+,     5b,    E1/E2,  5a,      6-/6,     WI6,   M6,     VI+
7-/7,    6a+/6b, VIIIa/VIIIb,  5.10c,  V0,      5a/5b, E1,     4c,      6,        WI6,   M6,     VI+/VI.1
7,       6b,     VIIIb,        5.11a,  V1,      5b/5c, E2,     5b,      6,        WI7,   M7,     VI.1
7,       6b,     VIIIb,        5.11a,  V1,      5b/5c, E2,     5b,      6,        WI7,   M7,     VI.1/1+
7/7+,    6b/6b+, VIIIb/VIIIc,  5.11a,  V1,      5b/5c, E2,     5b,      6,        WI7,   M7,     VI.1+
7/7+,    6b/6b+, VIIIb/VIIIc,  5.11a,  V1,      5b/5c, E2,     5b,      6,        WI7,   M7,     VI.1+/2
7+,      6b+,    VIIIc,        5.11b,  V1/V2,   5c,    E2/E3,  5c,      6/6+,     WI7,   M7,     VI.2
7+/8-,   6c,     VIIIc/IXa,    5.11b,  V1/V2,   5c,    E2/E3,  5c,      6+,       WI7,   M7,     VI.2/2+
8-,      6c/6c+, VIIIc/IXa,    5.11c,  V2,      5c/6a, E3,     6a,      6+/7-,    WI8,   M8,     VI.2+
8-,      6c+,    IXa,          5.11c,  V2,      5c/6a, E3,     6a,      7-,       WI8,   M8,     VI.2+
8-/8,    6c+/7a, IXa/IXb,      5.11c,  V2,      5c/6a, E3,     6a,      7-/7,     WI8,   M8,     VI.2+/3
8,       7a,     IXb,          5.11d,  V3,      6a,    E4,     6b,      7,        WI8,   M8,     VI.3
8,       7a,     IXb,          5.11d,  V3,      6a,    E4,     6b,      7/7+,     WI8,   M8,     VI.3/3+
8/8+,    7a/7a+, IXb/IXc,      5.11d,  V3,      6a,    E4,     6b,      7+,       WI8,   M8,     VI.3+
8/8+,    7a/7a+, IXb/IXc,      5.11d,  V3,      6a,    E4,     6b,      7+/8-,    WI8,   M8,     VI.3+
8+,      7a+,    IXc,          5.12a,  V3/V4,   6a,    E4/E5,  6b+,     8-,       WI8,   M8,     VI.3+/4
8+/9-,   7b,     IXc/Xa,       5.12a,  V3/V4,   6a,    E4/E5,  6b+,     8-,       WI8,   M8,     VI.4
8+/9-,   7b,     IXc/Xa,       5.12a,  V3/V4,   6a,    E4/E5,  6b+,     8-/8,     WI8,   M8,     VI.4
9-,      7b/7b+, IXc/Xa,       5.12b,  V4,      6b,    E5,     6c,      8,        WI8,   M8,     VI.4
9-,      7b+,    Xa,           5.12b,  V4,      6b,    E5,     6c,      8,        WI8,   M8,     VI.4/4+
9-/9,    7b+/7c, Xa/Xb,        5.12b,  V4,      6b,    E5,     6c,      8,        WI8,   M8,     VI.4+
9,       7c,     Xb,           5.12c,  V4/V5,   6b/6c, E6,     6c+,     8/8+,     WI9,   M9,     VI.4+/5
9/9+,    7c/7c+, Xb/Xc,        5.12c,  V4/V5,   6b/6c, E6,     6c+,     8+,       WI9,   M9,     VI.5
9+,      7c+,    Xc,           5.12d,  V5,      6c,    E6/E7,  7a,      8+,       WI9,   M9,     VI.5/5+
9+/10-,  8a,     Xc/XIa,       5.12d,  V5,      6c,    E6/E7,  7a,      8+/9-,    WI9,   M9,     VI.5+
10-,     8a/8a+, Xc/XIa,       5.13a,  V6,      6c,    E7,     7a+,     9-,       WI9,   M9,     VI.5+
10-,     8a+,    XIa,          5.13a,  V6,      6c,    E7,     7a+,     9-/9,     WI9,   M9,     VI.5+
10-/10,  8a+/8b, XIa/XIb,      5.13a,  V6,      6c,    E7,     7a+,     9,        WI9,   M9,     VI.5+/6
10,      8b,     XIb,          5.13b,  V6/V7,   6c/7a, E7/E8,  7a+/7b,  9,        WI9,   M9,     VI.6
10/10+,  8a/8a+, XIb/XIc,      5.13b,  V6/V7,   6c/7a, E7/E8,  7a+/7b,  9,        WI9,   M9,     VI.6/6+
10+,     8b+,    XIc,          5.13c,  V7,      7a,    E8,     7b,      9/9+,     WI10,  M10,    VI.6+
10+/11-, 8b+/8c, XIc/XIIa,     5.13c,  V7,      7a,    E8,     7b,      9+,       WI10,  M10,    VI.6+/7
11-,     8c,     XIIa,         5.13d,  V8,      7a,    E9,     7b+,     9+,       WI10,  M10,    VI.7
11-,     8c/8c+, XIIa,         5.13d,  V8,      7a,    E9,     7b+,     9+/10-,   WI10,  M10,    VI.7
11-/11,  8c+,    XIIa/XIIb,    5.13d,  V8,      7a,    E9,     7b+,     10-,      WI10,  M10,    VI.7
11-/11,  8c+/9a, XIIa/XIIb,    5.13d,  V8,      7a,    E9,     7b+,     10-,      WI10,  M10,    VI.7/7+
11,      9a,     XIIb,         5.14a,  V9,      7a/7b, E9/E10, 7c,      10-/10,   WI10,  M10,    VI.7+
11/11+,  9a/9a+, XIIb/XIIc,    5.14a,  V9,      7a/7b, E9/E10, 7c,      10,       WI10,  M10,    VI.7+/8
11+,     9a+,    XIIc,         5.14b,  V10,     7b,    E10,    7c+,     10,       WI10,  M10,    VI.8
11+,     9a+/9b, XIIc/XIIIa,   5.14b,  V10,     7b,    E10,    7c+,     10,       WI10,  M10,    VI.8
11+/12-, 9b,     XIIIa,        5.14b,  V10,     7b,    E10,    7c+,     10/10+,   WI10,  M10,    VI.8
11+/12-, 9b/9b+, XIIIa/XIIIb,  5.14b,  V10,     7b,    E10,    7c+,     10+,      WI10,  M10,    VI.8/8+
12-,     9b+,    XIIIb,        5.14c,  V10/V11, 7b,    E11,    7c+/8a,  10+/11-,  WI11,  M11,    VI.8+
12-/12,  9b+/9c, XIIIb/XIIIc,  5.14c,  V10/V11, 7b,    E11,    7c+/8a,  11-,      WI11,  M11,    VI.8+/9
12,      9c,     XIIIc,        5.14d,  V11,     7b,    E11,    8a,      11-,      WI11,  M11,    VI.9
12,      9c,     XIIIc,        5.14d,  V11,     7b,    E11,    8a,      11-/11+,  WI11,  M11,    VI.9
12/12+,  9c/9c+, XIIIc,        5.14d,  V11,     7b,    E11,    8a,      11,       WI11,  M11,    VI.9/9+
12+,     9c+,    XIIIc,        5.15a,  V12,     >7b,   >E11,   8a+/8b,  11,       WI11,  M11,    VI.9+
12+/13-, 10a,    >XIIIc,       5.15a,  V12,     >7b,   >E11,   8a+/8b,  11/11+,   WI11,  M11,    VI.9+
13-,     >10a,   >XIIIc,       5.15a,  V13,     >7b,   >E11,   8b,      11+,      WI11,  M11,    >VI.9+
13-/13,  >10a,   >XIIIc,       5.15a,  V13,     >7b,   >E11,   8b,      11+,      WI11,  M11,    >VI.9+
13,      >10a,   >XIIIc,       5.15b,  V14,     >7b,   >E11,   8b+,     11+,      WI12,  M12,    >VI.9+
13/13+,  >10a,   >XIIIc,       5.15b,  V14,     >7b,   >E11,   8b+,     11+/12-,  WI12,  M12,    >VI.9+
13+,     >10a,   >XIIIc,       5.15c,  V15,     >7b,   >E11,   8c,      12-,      WI13,  M13,    >VI.9+
13+,     >10a,   >XIIIc,       5.15c,  V15,     >7b,   >E11,   8c,      12-/12,   WI13,  M13,    >VI.9+
13+/14-, >10a,   >XIIIc,       5.15c,  V15,     >7b,   >E11,   8c,      12,       WI13,  M13,    >VI.9+
13+/14-, >10a,   >XIIIc,       5.15c,  V15,     >7b,   >E11,   8c,      12/12+,   WI13,  M13,    >VI.9+
14-,     >10a,   >XIIIc,       5.15d,  V15,     >7b,   >E11,   8c+,     12+,      WI13,  M13,    >VI.9+`;

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
  '6-/6': { light: '#D49D05', dark: '#efca00' },
  '6': { light: '#D49D05', dark: '#efca00' },
  '6/6+': { light: '#D49D05', dark: '#efca00' },
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
