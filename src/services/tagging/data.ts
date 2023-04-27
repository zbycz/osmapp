import fieldsJson from '@openstreetmap/id-tagging-schema/dist/fields.json';
import presetsJson from '@openstreetmap/id-tagging-schema/dist/presets.json';
import { Fields } from './types/Fields';
import { Presets } from './types/Presets';
import { publishDbgObject } from '../../utils';

export const fields = fieldsJson as unknown as Fields;

Object.keys(fieldsJson).forEach((fieldKey) => {
  fields[fieldKey].fieldKey = fieldKey;
});

export const presets = presetsJson as unknown as Presets;
Object.keys(presetsJson).forEach((presetKey) => {
  presets[presetKey].presetKey = presetKey;
});

publishDbgObject('presets', presets);
publishDbgObject('fields', fields);

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
