import { getSchemaForFeature } from '../idTaggingScheme';
import { Feature } from '../../types';
import { mockSchemaTranslations } from '../translations';
import translations from '../../../../data/tagging-schema.6.1.0.en.json';
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
      { label: 'Lit', value: 'no' },
    ]);
    expect(result.tagsWithFields).toMatchObject([
      { label: 'Allowed Access', value: 'xxxx' },
      { label: 'Layer', value: '1' },
    ]);
  });
});

const a = {
  key: 'bicycle',
  value: {
    title: 'Prohibited',
    description: 'Access not allowed to the general public',
  },
  field: {
    keys: ['access', 'foot', 'motor_vehicle', 'bicycle', 'horse'],
    reference: { key: 'access' },
    type: 'access',
    options: [
      'yes',
      'no',
      'permissive',
      'private',
      'designated',
      'destination',
      'customers',
      'dismount',
      'permit',
      'unknown',
    ],
    fieldKey: 'access',
  },
  tagsForField: [
    {
      key: 'foot',
      value: 'no',
    },
    {
      key: 'bicycle',
      value: 'no',
    },
    {
      key: 'horse',
      value: 'no',
    },
  ],
  fieldTranslation: {
    label: 'Allowed Access',
    placeholder: 'Not Specified',
    types: {
      access: 'All',
      foot: 'Foot',
      motor_vehicle: 'Motor Vehicles',
      bicycle: 'Bicycles',
      horse: 'Horses',
    },
    options: {
      yes: {
        title: 'Allowed',
        description: 'Access allowed by law; a right of way',
      },
      no: {
        title: 'Prohibited',
        description: 'Access not allowed to the general public',
      },
      permissive: {
        title: 'Permissive',
        description:
          'Access allowed until such time as the owner revokes the permission',
      },
      private: {
        title: 'Private',
        description:
          'Access allowed only with permission of the owner on an individual basis',
      },
      designated: {
        title: 'Designated',
        description: 'Access allowed according to signs or specific local laws',
      },
      destination: {
        title: 'Destination',
        description: 'Access allowed only to reach a destination',
      },
      customers: {
        title: 'Customers',
        description: 'Restricted to customers at the destination',
      },
      dismount: {
        title: 'Dismount',
        description: 'Access allowed but rider must dismount',
      },
      permit: {
        title: 'Permit',
        description: 'Access allowed only with a valid permit or license',
      },
      unknown: {
        title: 'Unknown',
        description: 'Access conditions are unknown or unclear',
      },
    },
  },
  label: 'Allowed Access',
};
