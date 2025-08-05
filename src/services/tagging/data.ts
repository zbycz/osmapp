import fieldsJson from '@openstreetmap/id-tagging-schema/dist/fields.json';
import presetsJson from '@openstreetmap/id-tagging-schema/dist/presets.json';
import { Fields } from './types/Fields';
import { Presets } from './types/Presets';
import { publishDbgObject } from '../../utils';
import { modifyPresets, ourFields } from './ourPresets';

export const allFields = { ...fieldsJson, ...ourFields } as unknown as Fields;
Object.keys(allFields).forEach((fieldKey) => {
  allFields[fieldKey].fieldKey = fieldKey;
});

export const allPresets: Presets = modifyPresets(
  presetsJson as unknown as Presets,
);
Object.keys(allPresets).forEach((presetKey) => {
  allPresets[presetKey].presetKey = presetKey;
});

publishDbgObject('allPresets', allPresets);
publishDbgObject('allFields', allFields);

// TODO build a key lookup table for fields by osm key ?
// const fieldsByOsmKey = {};
// Object.entries(fields).forEach(([fieldKey, field]) => {
//   if (field.key) {
//     fieldsByOsmKey[field.key] = fieldKey;
//   }
//   if (field.keys) {
//     field.keys.forEach((key) => (fieldsByOsmKey[key] = fieldKey));
//   }
// });
