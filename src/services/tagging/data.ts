import fieldsJson from '../../../data/fields.json';
import { Fields } from './types/Fields';
import presetsJson from '../../../data/presets.json';
import { Presets } from './types/Presets';

export const fields = fieldsJson as unknown as Fields;

Object.keys(fieldsJson).forEach((fieldKey) => {
  fields[fieldKey].fieldKey = fieldKey;
});

export const presets = presetsJson as unknown as Presets;
Object.keys(presetsJson).forEach((presetKey) => {
  presets[presetKey].presetKey = presetKey;
});

// build a key lookup table for fields by osm key
// const fieldsByOsmKey = {};
// Object.entries(fields).forEach(([fieldKey, field]) => {
//   if (field.key) {
//     fieldsByOsmKey[field.key] = fieldKey;
//   }
//   if (field.keys) {
//     field.keys.forEach((key) => (fieldsByOsmKey[key] = fieldKey));
//   }
// });
