// The order of this array must be the same as CSV in gradeData.ts
export const GRADE_SYSTEMS = [
  {
    key: 'uiaa',
    name: 'UIAA',
    description:
      'Grade system used by the International Climbing and Mountaineering Federation.',
  },
  {
    key: 'british_traditional',
    name: 'British technical',
    description: 'The British grading system for traditional climbs.',
  },
  {
    key: 'british_adjectival',
    name: 'British Adjectival',
    description:
      'The Adjectival British Scale or the overall assessment scale.',
  },
  {
    key: 'french_british',
    name: 'French British',
    description:
      'Sport climbing in Britain and Ireland uses the French grading system.',
  },
  {
    key: 'french',
    name: 'French',
    description:
      'The French numerical system (Fontainebleau scale) rates a climb according to the overall technical difficulty and strenuousness of the route.',
  },
  {
    key: 'saxon',
    name: 'Saxon',
    description:
      'The Saxon grading system was developed in the beginning of the 20th century for the formidable Saxon Switzerland climbing region.',
  },
  { key: 'nordic', name: 'Nordic', description: 'The Nordic grading system.' },
  {
    key: 'yds_class',
    name: 'YDS',
    description:
      'The Yosemite Decimal System of grading routes of hikes and climbs developed for the Sierra Nevada range.',
  },
  {
    key: 'hueco',
    name: 'V grade',
    description:
      'V scale grading system, created by John Sherman, which is the most widely used system in North America.',
  },
  {
    key: 'ice',
    name: 'WI',
    description: 'Waterfall ice rating system as used in the Canadian Rockies.',
  },
  {
    key: 'mixed',
    name: 'Mixed',
    description:
      'Mixed climbing has its own grading scale that roughly follows the WI rating system.',
  },
];

export type GradeSystem = (typeof GRADE_SYSTEMS)[number]['key'];

export const getGradeSystemName = (gradeSystemKey: GradeSystem) =>
  GRADE_SYSTEMS.find((item) => item.key === gradeSystemKey)?.name;
