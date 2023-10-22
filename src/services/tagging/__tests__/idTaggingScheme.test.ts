import translations from '@openstreetmap/id-tagging-schema/dist/translations/en.json';
import { beforeEach } from '@jest/globals';
import { getSchemaForFeature } from '../idTaggingScheme';
import { Feature } from '../../types';
import { mockSchemaTranslations } from '../translations';
import { intl } from '../../intl';
import { computeAllFieldKeys } from '../fields';

intl.lang = 'en';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { languages: ['en'] },
}));

describe('idTaggingScheme', () => {
  beforeEach(() => {
    mockSchemaTranslations(translations);
  });

  it('should multiple access', () => {
    const feature = {
      osmMeta: { type: 'way' },
      tags: {
        bicycle: 'no',
        bridge: 'yes',
        foot: 'no',
        hgv: 'designated',
        highway: 'motorway',
        horse: 'no',
        lanes: '2',
        layer: '1',
        lit: 'no',
        maxspeed: '55 mph',
        oneway: 'yes',
        ref: 'I 84',
        surface: 'asphalt',
        'tiger:cfcc': 'A15',
        'tiger:county': 'Orange, NY',
        'tiger:name_base': 'I-84',
      },
    } as unknown as Feature;

    const result = getSchemaForFeature(feature);

    expect(result.label).toBe('Motorway');
    expect(result.presetKey).toBe('highway/motorway');
    expect(result.matchedFields).toMatchObject([
      { label: 'Road Number', value: 'I 84' },
      { label: 'One Way', value: 'Yes' },
      { label: 'Speed Limit', value: '55 mph' },
      { label: 'Lanes', value: '2' },
      { label: 'Surface', value: 'Asphalt' },
      {
        label: 'Allowed Access',
        value: 'Foot: Prohibited,\nBicycles: Prohibited,\nHorses: Prohibited',
      },
      { label: 'Lit', value: 'no' },
    ]);
    expect(result.tagsWithFields).toMatchObject([
      { label: 'Layer', value: '1' },
    ]);
    expect(result.keysTodo).toMatchObject([
      'hgv',
      'tiger:cfcc',
      'tiger:county',
      'tiger:name_base',
    ]);
  });

  it('should use @template field', () => {
    const featureWithTemplate = {
      osmMeta: { type: 'way' },
      tags: { amenity: 'school' },
    } as unknown as Feature;

    const schema = getSchemaForFeature(featureWithTemplate);
    const computedAllFieldKeys = computeAllFieldKeys(schema.preset);

    expect(computedAllFieldKeys).toEqual([
      'amenity',
      'name',
      'operator',
      'operator/type',
      'address',
      'grades',
      'religion',
      'denomination',
      'website',
      'building_area',
      'email',
      'fax',
      'mobile',
      'phone',
      'internet_access',
      'internet_access/fee',
      'internet_access/ssid',
      'capacity',
      'charge_fee',
      'fee',
      'gnis/feature_id-US',
      'level',
      'polling_station',
      'wheelchair',
      'wikimedia_commons',
      'wikidata',
      'start_date',
      'note',
      'mapillary',
      'image',
      'fixme',
      'ele_node',
      'description',
      'ref/linz/place_id-NZ',
    ]);
  });

  it('should map all tags to fields', () => {
    const feature = {
      osmMeta: {
        type: 'way',
      },
      tags: {
        "amenity": "clock",
        "check_date": "2023-07-03",
        "display": "analog",
        "man_made": "tower",
        "support": "tower",
        "tower:type": "clock",
        "visibility": "street"
      },
    } as unknown as Feature;

    const schema = getSchemaForFeature(feature);

    expect(schema.featuredTags).toEqual([['wikidata', 'Q94435643']]);
    expect(schema.matchedFields.map((x) => x.field.fieldKey)).toEqual([
      'water',
      'wikimedia_commons',
    ]);
    expect(schema.tagsWithFields.map((x) => x.field.fieldKey)).toEqual([
      'horse_stables',
      'source',
    ]);
    expect(schema.keysTodo).toEqual([]);
  });
});
