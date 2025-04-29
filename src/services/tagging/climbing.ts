// The order of this array must be the same as CSV in gradeData.ts
export const GRADE_SYSTEMS = [
  {
    key: 'uiaa',
    name: 'UIAA',
    flags: '🇪🇺',
    minor: false,
    description:
      'Grade system used by the International Climbing and Mountaineering Federation. Widely used in Alps and central Europe.',
  },
  {
    key: 'french',
    name: 'French',
    flags: '🇪🇺',
    minor: false,
    description:
      'The French numerical system (Fontainebleau scale) rates a climb according to the overall technical difficulty and strenuousness of the route. Widely used, mainly in western Europe.',
  },
  {
    key: 'saxon',
    name: 'Saxon',
    flags: '🇩🇪🇨🇿',
    minor: false,
    description:
      'The Saxon grading system was developed in the beginning of the 20th century for the formidable Saxon Switzerland (Germany, Czechia) climbing region with strict ethics.',
  },
  {
    key: 'yds_class',
    name: 'YDS',
    flags: '🇺🇸',
    minor: false,
    description:
      'The Yosemite Decimal System of grading routes of hikes and climbs developed for the Sierra Nevada range (USA).',
  },
  {
    key: 'hueco',
    name: 'V scale',
    flags: '🇺🇸',
    minor: false,
    description:
      'V scale grading system, created by John Sherman, which is the most widely used system in North America.',
  },
  {
    key: 'british_traditional',
    name: 'British technical',
    flags: '🇬🇧',
    minor: true,
    description: 'The British grading system for traditional climbs.',
  },
  {
    key: 'british_adjectival',
    name: 'British Adjectival',
    flags: '🇬🇧',
    minor: true,
    description:
      'The Adjectival British Scale or the overall assessment scale.',
  },
  {
    key: 'french_british',
    name: 'French British',
    flags: '🇬🇧🇮🇪',
    minor: true,
    description:
      'Sport climbing in Britain and Ireland uses the French grading system.',
  },
  {
    key: 'nordic',
    name: 'Nordic',
    flags: '🇳🇴🇸🇪',
    minor: true,
    description: 'The Nordic grading system.',
  },
  {
    key: 'ice',
    name: 'WI',
    flags: '🇨🇦',
    minor: true,
    description: 'Waterfall ice rating system as used in the Canadian Rockies.',
  },
  {
    key: 'mixed',
    name: 'Mixed',
    minor: true,
    description:
      'Mixed climbing has its own grading scale that roughly follows the WI rating system.',
  },
];

export type GradeSystem = (typeof GRADE_SYSTEMS)[number]['key'];

export const getGradeSystemName = (gradeSystemKey: GradeSystem) =>
  GRADE_SYSTEMS.find((item) => item.key === gradeSystemKey)?.name;
