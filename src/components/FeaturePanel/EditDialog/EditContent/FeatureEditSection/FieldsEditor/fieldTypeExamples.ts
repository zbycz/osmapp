import { FeatureTags } from '../../../../../../services/types';

/**
 * Example OSM elements ({ shortId, tags }) used to exercise the FieldsEditor.
 *
 * Together they cover every field `type` defined by the iD tagging schema.
 * `demonstrates` is the fieldKey (from id-tagging-schema fields.json) whose
 * field type this element is meant to render — see FieldsEditor.test.tsx.
 *
 * These are also handy when manually testing the editor in the app (enable the
 * "experimental iD-style fields editor" debug flag in User settings).
 */
export type FieldTypeExample = {
  shortId: string;
  tags: FeatureTags;
  demonstrates: string;
};

export const FIELD_TYPE_EXAMPLES: FieldTypeExample[] = [
  {
    shortId: 'w1',
    tags: { highway: 'track', access: 'private', foot: 'yes' },
    demonstrates: 'access', // access
  },
  {
    shortId: 'n2',
    tags: {
      amenity: 'cafe',
      'addr:housenumber': '12',
      'addr:street': 'Main Street',
      'addr:city': 'Springfield',
    },
    demonstrates: 'address', // address
  },
  {
    shortId: 'n3',
    tags: { amenity: 'drinking_water', water_point: 'yes' },
    demonstrates: 'water_point', // check
  },
  {
    shortId: 'n4',
    tags: { amenity: 'bench', colour: '#ff0000' },
    demonstrates: 'colour', // colour
  },
  {
    shortId: 'w5',
    tags: { natural: 'wetland', wetland: 'marsh' },
    demonstrates: 'wetland', // combo
  },
  {
    shortId: 'n6',
    tags: { historic: 'monument', start_date: '1905' },
    demonstrates: 'start_date', // date
  },
  {
    shortId: 'w7',
    tags: { man_made: 'embankment', two_sided: 'yes' },
    demonstrates: 'two_sided', // defaultCheck
  },
  {
    shortId: 'w8',
    tags: { highway: 'residential', 'cycleway:left': 'lane' },
    demonstrates: 'cycleway', // directionalCombo
  },
  {
    shortId: 'n9',
    tags: { amenity: 'restaurant', email: 'info@example.com' },
    demonstrates: 'email', // email
  },
  {
    shortId: 'n10',
    tags: { tourism: 'artwork', wikimedia_commons: 'File:Example.jpg' },
    demonstrates: 'wikimedia_commons', // identifier
  },
  {
    shortId: 'n11',
    tags: { place: 'city', name: 'New York', short_name: 'NYC' },
    demonstrates: 'short_name', // localized
  },
  {
    shortId: 'r12',
    tags: { type: 'route', route: 'bus', bus: 'yes', tram: 'yes' },
    demonstrates: 'vehicles', // manyCombo
  },
  {
    shortId: 'n13',
    tags: { power: 'plant', 'plant:output:electricity': '50 MW' },
    demonstrates: 'plant/output', // multiCombo
  },
  {
    shortId: 'w14',
    tags: { highway: 'motorway', network: 'US:I' },
    demonstrates: 'network_road', // networkCombo
  },
  {
    shortId: 'n15',
    tags: { power: 'transformer', windings: '2' },
    demonstrates: 'windings', // number
  },
  {
    shortId: 'w16',
    tags: { highway: 'residential', oneway: 'yes' },
    demonstrates: 'oneway_yes', // onewayCheck
  },
  {
    shortId: 'n17',
    tags: { amenity: 'cafe', wheelchair: 'limited' },
    demonstrates: 'wheelchair', // radio
  },
  {
    shortId: 'r18',
    tags: { type: 'restriction', restriction: 'no_left_turn' },
    demonstrates: 'restrictions', // restrictions
  },
  {
    shortId: 'w19',
    tags: { highway: 'residential', maxwidth: '3.5' },
    demonstrates: 'maxwidth', // roadheight
  },
  {
    shortId: 'w20',
    tags: { highway: 'motorway', minspeed: '30' },
    demonstrates: 'minspeed', // roadspeed
  },
  {
    shortId: 'n21',
    tags: { amenity: 'waste_basket', waste: 'cigarettes;dog_excrement' },
    demonstrates: 'waste', // semiCombo
  },
  {
    shortId: 'w22',
    tags: { waterway: 'canal', tunnel: 'culvert' },
    demonstrates: 'structure_waterway', // structureRadio
  },
  {
    shortId: 'n23',
    tags: { amenity: 'restaurant', phone: '+1-202-555-0123' },
    demonstrates: 'phone', // tel
  },
  {
    shortId: 'n24',
    tags: { aeroway: 'aerodrome', vhf: '120.5' },
    demonstrates: 'vhf', // text
  },
  {
    shortId: 'n25',
    tags: { amenity: 'cafe', note: 'Closed on Mondays.' },
    demonstrates: 'note', // textarea
  },
  {
    shortId: 'n26',
    tags: { shop: 'trade', wholesale: 'building_materials' },
    demonstrates: 'wholesale', // typeCombo
  },
  {
    shortId: 'n27',
    tags: { amenity: 'cafe', website: 'https://example.com' },
    demonstrates: 'website', // url
  },
  {
    shortId: 'n28',
    tags: { tourism: 'museum', wikidata: 'Q42' },
    demonstrates: 'wikidata', // wikidata
  },
  {
    shortId: 'n29',
    tags: { tourism: 'museum', wikipedia: 'en:Example' },
    demonstrates: 'wikipedia', // wikipedia
  },
  {
    shortId: 'n30',
    tags: { amenity: 'restaurant', internet_access: 'wlan' },
    demonstrates: 'internet_access', // combo (customValues:false)
  },
];
