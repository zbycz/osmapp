import fieldsJson from '@openstreetmap/id-tagging-schema/dist/fields.json';
import presetsJson from '@openstreetmap/id-tagging-schema/dist/presets.json';
import { Fields } from './types/Fields';
import { Presets } from './types/Presets';
import { publishDbgObject } from '../../utils';


const ourPresets = { // i want only sport=climbing without gyms: leisure=sport_center
  'leisure/climbing/site': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'way', 'area'],
    fields: [],
    tags: {
      sport: 'climbing'
    },
    reference: {
      key: 'sport',
      value: 'climbing',
    },
    name: 'Climbing site', // could be both gym or
  },
  'leisure/climbing/route': {
    icon: 'temaki-abseiling',
    geometry: ['point', 'way'],
    fields: [],
    tags: {
      climbing: 'route',
    },
    addTags: {
      sport: 'climbing',
      climbing: 'route',
    },
    reference: {
      key: 'climbing',
      value: 'route',
    },
    name: 'Climbing route',
  },
  'leisure/climbing/route_bottom': {
    icon: 'temaki-abseiling',
    geometry: ['point'],
    fields: [],
    tags: {
      climbing: 'route_bottom',
    },
    reference: {
      key: 'climbing',
      value: 'route',
    },
    name: 'Bottom of climbing route',
  },
  'leisure/climbing/route_top': {
    icon: 'temaki-abseiling',
    geometry: ['point'],
    fields: [],
    tags: {
      climbing: 'route_top',
    },
    reference: {
      key: 'climbing',
      value: 'route',
    },
    name: 'Top of climbing route',
  },
} as Presets;


export const fields = fieldsJson as unknown as Fields;

Object.keys(fieldsJson).forEach((fieldKey) => {
  fields[fieldKey].fieldKey = fieldKey;
});

const upstreamPresets = presetsJson as unknown as Presets;
export const presets = { ...upstreamPresets, ...ourPresets };
Object.keys(presets).forEach((presetKey) => {
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
