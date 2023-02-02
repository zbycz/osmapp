import { fetchJson } from '../fetch';

// https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@6.0.0-rc.1/dist/translations/cs.min.json
const cdnUrl = `https://cdn.jsdelivr.net/npm/@openstreetmap`;

let translations;
const fetchTranslations = async () => {
  const presetsPackage = await fetchJson(
    `${cdnUrl}/id-tagging-schema/package.json`,
  );
  const version = presetsPackage.version;

  translations = await fetchJson(
    `${cdnUrl}/id-tagging-schema@${version}/dist/translations/cs.min.json`,
  );
};
fetchTranslations();

export const getPresetTranslation = (key: string) => {
  return translations ? translations.cs.presets.presets[key].name : undefined;
};

export const getFieldTranslation = (key: string) => {
  // fields.access.types is what ????

  return translations ? translations.cs.presets.fields[key] : undefined;
};
