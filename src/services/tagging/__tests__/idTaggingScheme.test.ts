import { getSchemaForFeature } from '../idTaggingScheme';
import { Feature } from '../../types';
import { mockSchemaTranslations } from '../translations';
import translations from '@openstreetmap/id-tagging-schema/dist/translations/en.json';
import { intl } from '../../intl';

intl.lang = 'en';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { languages: ['en'] },
}));

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

describe('idTaggingScheme', () => {
  it('should multiple access', () => {
    mockSchemaTranslations(translations);

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
  });
});
