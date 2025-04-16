import translations from '@openstreetmap/id-tagging-schema/dist/translations/en.json';
import { getSchemaForFeature } from '../idTaggingScheme';
import { Feature } from '../../types';
import { mockSchemaTranslations } from '../translations';
import { intl } from '../../intl';
import { getFieldKeys } from '../fields';

intl.lang = 'en';

describe('idTaggingScheme', () => {
  beforeEach(() => {
    mockSchemaTranslations(translations);
  });

  it('should render multiple access=*', () => {
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
    expect(
      result.matchedFields.map(({ label, value }) => ({ label, value })),
    ).toMatchObject([
      { label: 'Road Number', value: 'I 84' },
      { label: 'One Way', value: 'Yes' },
      { label: 'Speed Limit', value: '55 mph' },
      { label: 'Lanes', value: '2' },
      { label: 'Surface', value: 'Asphalt' },
      { label: 'Structure', value: undefined },
      {
        label: 'Allowed Access',
        value:
          'Foot: Prohibited – Access not allowed to the general public,\n' +
          'Bicycles: Prohibited – Access not allowed to the general public,\n' +
          'Horses: Prohibited – Access not allowed to the general public',
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

  it('should work for parging surface', () => {
    const feature = {
      osmMeta: { type: 'way', id: 1200404964 },
      tags: {
        amenity: 'parking',
        parking: 'surface',
        surface: 'unpaved',
        smoothness: 'bad',
      },
    } as unknown as Feature;

    const result = getSchemaForFeature(feature);

    expect(result.label).toBe('Parking Lot');
    expect(result.presetKey).toBe('amenity/parking');
    expect(
      result.matchedFields.map(({ label, value }) => ({ label, value })),
    ).toMatchObject([
      { label: 'Type', value: 'Surface' },
      { label: 'Surface', value: 'Unpaved' },
    ]);
    expect(result.tagsWithFields).toMatchObject([
      {
        label: 'Smoothness',
        value: 'Robust Wheels: trekking bike, car, rickshaw',
      },
    ]);
    expect(result.keysTodo).toMatchObject([]);
  });

  it('should use @template field', () => {
    const featureWithTemplate = {
      osmMeta: { type: 'way' },
      tags: { amenity: 'school' },
    } as unknown as Feature;

    const schema = getSchemaForFeature(featureWithTemplate);
    const computedAllFieldKeys = getFieldKeys(schema.preset);

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
      'fhrs/id-GB',
      'gnis/feature_id-US',
      'ref/edubase-GB',
      'level',
      'polling_station',
      'wheelchair',
      'wikimedia_commons',
      'wikidata',
      'start_date',
      'short_name',
      'reg_name',
      'official_name',
      'note',
      'nat_name',
      'mapillary',
      'loc_name',
      'fixme',
      'ele_node',
      'description',
      'alt_name',
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
        non_existing123: 'xxxx',
      },
    } as unknown as Feature;

    const schema = getSchemaForFeature(feature);

    expect(schema.label).toBe('Fountain');
    expect(schema.featuredTags).toEqual([['wikidata', 'Q94435643']]);
    expect(schema.matchedFields.map((x: any) => x.field.fieldKey)).toEqual([]);
    expect(schema.tagsWithFields.map((x: any) => x.field.fieldKey)).toEqual([
      'natural',
      'source',
      'water',
    ]);
    expect(schema.keysTodo).toEqual(['non_existing123']);
  });

  it('should remove from keysTodo if address is in restTags', () => {
    // TOOD find better tags which have some multikey field in tagsWithFields
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
      'source',
      'tourism',
    ]);
  });
});
