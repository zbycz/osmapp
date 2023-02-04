import { fetchJson } from '../fetch';

const lang = 'en';

// https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@6.0.0-rc.1/dist/translations/cs.min.json
const cdnUrl = `https://cdn.jsdelivr.net/npm/@openstreetmap`;

let translations;
const fetchTranslations = async () => {
  const presetsPackage = await fetchJson(
    `${cdnUrl}/id-tagging-schema/package.json`,
  );
  const { version } = presetsPackage;

  translations = await fetchJson(
    `${cdnUrl}/id-tagging-schema@${version}/dist/translations/${lang}.min.json`,
  );
};
fetchTranslations();

export const getPresetTranslation = (key: string) =>
  translations ? translations[lang].presets.presets[key].name : undefined;

export const getFieldTranslation = (key: string) =>
  // fields.access.types is what ????

  translations ? translations[lang].presets.fields[key] : undefined;
