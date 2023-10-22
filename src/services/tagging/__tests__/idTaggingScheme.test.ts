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

const feature = {
  type: 'Feature',
  center: [14.4092441, 50.0910942],
  osmMeta: {
    type: 'way',
    id: 149398903,
    timestamp: '2023-08-06T12:00:52Z',
    version: 7,
    changeset: 139512928,
    user: 'tg4567',
    uid: 12500589,
  },
  tags: {
    amenity: 'fountain',
    natural: 'water',
    source: 'CZ:IPRPraha:ortofoto',
    water: 'fountain',
    wikidata: 'Q94435643',
    wikimedia_commons: 'Category:Fountain (metro Malostranská)',
  },
  properties: { class: 'fountain', subclass: 'fountain' },
} as unknown as Feature;

const featureWithTemplate = {
  osmMeta: { type: 'way' },
  tags: { amenity: 'school' },
} as unknown as Feature;

describe('idTaggingScheme', () => {
  beforeEach(() => {
    mockSchemaTranslations(translations);
  });

  it('should multiple access', () => {
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
    ]);
  });
});
