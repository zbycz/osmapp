export type FeaturedKeyRenderer =
  | 'WebsiteRenderer'
  | 'PhoneRenderer'
  | 'OpeningHoursRenderer'
  | 'FoodHygieneRatingSchemeRenderer'
  | 'WikipediaRenderer'
  | 'WikidataRenderer'
  | 'ClimbingGradeRenderer'
  | 'ScaleRenderer'
  | 'NullRenderer' // - doesn't render among other FeaturedTags
  | 'DescriptionRenderer'; // - used directly in FeaturePanel

export type FeaturedKey = {
  matcher: RegExp;
  renderer: FeaturedKeyRenderer;
  uniqPredicate?: (k: string, v: string) => string;
};
export type FeaturedKeys = FeaturedKey[];

export const FEATURED_KEYS: FeaturedKeys = [
  {
    matcher: /website|url/,
    renderer: 'WebsiteRenderer',
    uniqPredicate: (_, v) => v.replace('https', 'http').replace(/\/$/, ''),
  },
  {
    matcher: /phone|contact:mobile/,
    renderer: 'PhoneRenderer',
    uniqPredicate: (_, v) => v.replace(/\s+/g, ''),
  },
  { matcher: /(opening|service)_hours/, renderer: 'OpeningHoursRenderer' },
  { matcher: /^wikipedia/, renderer: 'WikipediaRenderer' },
  { matcher: /^wikidata/, renderer: 'WikidataRenderer' },
  { matcher: /fhrs:id/, renderer: 'FoodHygieneRatingSchemeRenderer' },
  { matcher: /climbing:grade:/, renderer: 'ClimbingGradeRenderer' },
  { matcher: /(via_ferrata_scale|sac_scale)/, renderer: 'ScaleRenderer' },
  { matcher: /description/, renderer: 'NullRenderer' },
];

// more ideas in here, run in browser: Object.values(dbg.fields).filter(f=>f.universal)
