import translations from '@openstreetmap/id-tagging-schema/dist/translations/en.json';
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
      'fixme',
      'ele_node',
      'description',
      'ref/linz/place_id-NZ',
      'architect',
    ]);
  });

  it('should map all tags to fields', () => {
    const feature = {
      osmMeta: {
        type: 'way',
        id: 149398903,
      },
      tags: {
        amenity: 'fountain',
        natural: 'water',
        source: 'CZ:IPRPraha:ortofoto',
        water: 'fountain',
        wikidata: 'Q94435643',
        wikimedia_commons: 'Category:Fountain (metro Malostranská)',
      },
    } as unknown as Feature;

    const schema = getSchemaForFeature(feature);

    expect(schema.label).toBe('Fountain');
    expect(schema.featuredTags).toEqual([['wikidata', 'Q94435643']]);
    expect(schema.matchedFields.map((x: any) => x.field.fieldKey)).toEqual([
      'wikimedia_commons',
    ]);
    expect(schema.tagsWithFields.map((x: any) => x.field.fieldKey)).toEqual([
      'source',
      'water',
    ]);
    expect(schema.keysTodo).toEqual(['natural']);
  });

  it('should remove from keysTodo if address is in restTags', () => {
    const feature = {
      osmMeta: {
        type: 'way',
        id: 149398903,
      },
      tags: {
        'addr:city': 'Brno',
        'addr:country': 'CZ',
        historic: 'city_gate',
        source: 'cuzk:km',
        tourism: 'museum',
        asdf: 'asdf',
      },
    } as unknown as Feature;

    const schema = getSchemaForFeature(feature);

    expect(schema.presetKey).toEqual('historic/city_gate');
    expect(schema.tagsWithFields.map((x: any) => x.field.fieldKey)).toEqual([
      'address',
      'source',
    ]);
  });
});
