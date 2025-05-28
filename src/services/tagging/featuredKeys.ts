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
};
export type FeaturedKeys = FeaturedKey[];

export const FEATURED_KEYS: FeaturedKeys = [
  { matcher: /website/, renderer: 'WebsiteRenderer' },
  { matcher: /url/, renderer: 'WebsiteRenderer' },
  { matcher: /phone/, renderer: 'PhoneRenderer' },
  { matcher: /contact:phone/, renderer: 'PhoneRenderer' },
  { matcher: /contact:mobile/, renderer: 'PhoneRenderer' },
  { matcher: /opening_hours/, renderer: 'OpeningHoursRenderer' },
  { matcher: /service_hours/, renderer: 'OpeningHoursRenderer' },
  { matcher: /wikipedia/, renderer: 'WikipediaRenderer' },
  { matcher: /wikidata/, renderer: 'WikidataRenderer' },
  { matcher: /fhrs:id/, renderer: 'FoodHygieneRatingSchemeRenderer' },
  { matcher: /climbing:grade:/, renderer: 'ClimbingGradeRenderer' },
  { matcher: /(via_ferrata_scale|sac_scale)/, renderer: 'ScaleRenderer' },
  { matcher: /description/, renderer: 'NullRenderer' },
];

// more ideas in here, run in browser: Object.values(dbg.fields).filter(f=>f.universal)
