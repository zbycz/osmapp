import { intl } from '../../intl';
import {
  getPresetTermsTranslation,
  mockSchemaTranslations,
} from '../translations';

intl.lang = 'en';

describe('getPresetTermsTranslation', () => {
  it('returns terms as-is when already a string[] (current id-tagging-schema format)', () => {
    mockSchemaTranslations({
      en: { presets: { presets: { shop: { terms: ['retailer', 'store'] } } } },
    });

    expect(getPresetTermsTranslation('shop')).toEqual(['retailer', 'store']);
  });

  it('splits a comma-separated string (older id-tagging-schema format)', () => {
    mockSchemaTranslations({
      en: { presets: { presets: { shop: { terms: 'retailer,store' } } } },
    });

    expect(getPresetTermsTranslation('shop')).toEqual(['retailer', 'store']);
  });

  it('returns [] when the preset has no terms', () => {
    mockSchemaTranslations({
      en: { presets: { presets: { shop: { name: 'Shop' } } } },
    });

    expect(getPresetTermsTranslation('shop')).toEqual([]);
  });

  it('returns [] for an unknown preset key', () => {
    mockSchemaTranslations({ en: { presets: { presets: {} } } });

    expect(getPresetTermsTranslation('does-not-exist')).toEqual([]);
  });
});
