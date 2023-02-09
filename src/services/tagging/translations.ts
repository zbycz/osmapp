import { fetchJson } from '../fetch';
import { Field } from './types/Fields';

const lang = 'en';

// https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@6.0.0-rc.1/dist/translations/cs.min.json
const cdnUrl = `https://cdn.jsdelivr.net/npm/@openstreetmap`;

let translations;
export const fetchSchemaTranslations = async () => {
  if (translations) return;

  const presetsPackage = await fetchJson(
    `${cdnUrl}/id-tagging-schema/package.json`,
  );
  const { version } = presetsPackage;

  translations = await fetchJson(
    `${cdnUrl}/id-tagging-schema@${version}/dist/translations/${lang}.min.json`,
  );
};

export const getPresetTranslation = (key: string) =>
  translations ? translations[lang].presets.presets[key].name : undefined;

export const getFieldTranslation = (field: Field) => {
  if (!translations) return undefined;

  if (field.label?.match(/^{.*}$/)) {
    const resolved = field.label.substr(1, field.label.length - 2);
    return translations[lang].presets.fields[resolved];
  }

  return translations[lang].presets.fields[field.fieldKey];
};
