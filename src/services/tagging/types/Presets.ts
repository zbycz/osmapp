import { Field } from './Fields';

/**
 * Associates an icon, form fields, and other UI with a set of OSM tags
 */
export interface Preset {
  // added by osmapp (not in schema)
  presetKey: string;

  /**
   * The English name for the feature. A preset can reference the label of another by using that preset's identifier contained in brackets (e.g. {preset}), in which case also the preset's aliases and terms will also be referenced from that preset.
   */
  name?: string;
  /**
   * Valid geometry types for the feature, in order of preference
   */
  geometry?: [
    'point' | 'vertex' | 'line' | 'area' | 'relation',
    ...('point' | 'vertex' | 'line' | 'area' | 'relation')[]
  ];
  /**
   * Tags that must be present for the preset to match
   */
  tags?: {
    [k: string]: string;
  };
  /**
   * Tags that are added when changing to the preset (default is the same value as 'tags')
   */
  addTags?: {
    [k: string]: string;
  };
  /**
   * Tags that are removed when changing to another preset (default is the same value as 'addTags' which in turn defaults to 'tags')
   */
  removeTags?: {
    [k: string]: string;
  };
  /**
   * Default form fields that are displayed for the preset. A preset can reference the fields of another by using that preset's identifier contained in brackets, like {preset}.
   */
  fields?: string[];
  /**
   * Additional form fields that can be attached with the 'Add field' dropdown. A preset can reference the "moreFields" of another by using that preset's identifier contained in brackets, like {preset}.
   */
  moreFields?: string[];
  /**
   * Name of preset icon which represents this preset
   */
  icon?: string;
  /**
   * The URL of a remote image that is more specific than 'icon'
   */
  imageURL?: string;
  /**
   * English search terms or related keywords
   */
  terms?: string[];
  /**
   * Display-ready English synonyms for the `name`
   */
  aliases?: string[];
  /**
   * Whether or not the preset will be suggested via search
   */
  searchable?: boolean;
  /**
   * The quality score this preset will receive when being compared with other matches (higher is better)
   */
  matchScore?: number;
  /**
   * Taginfo documentation parameters (to be used when a preset manages multiple tags)
   */
  reference?: {
    /**
     * For documentation of a key
     */
    key?: string;
    /**
     * For documentation of a tag (key and value)
     */
    value?: string;
  };
  /**
   * The ID of a preset that is preferable to this one
   */
  replacement?: string;
  /**
   * An object specifying the IDs of regions where this preset is or isn't valid. See: https://github.com/ideditor/location-conflation
   */
  locationSet?: {
    include?: string[];
    exclude?: string[];
  };
}

export type Presets = {
  [presetKey: string]: Preset;
};

export type FieldTranslation = {
  label: string;
  placeholder: string;
  terms: string;
  options: {
    [key: string]: { title: string; description: string };
  };
  types: {
    [key: string]: string;
  };
};

export interface UiField {
  key: string;
  value: string;
  label: string;
  tagsForField: Array<{ key: string; value: string }>;
  fieldTranslation?: FieldTranslation;
  field: Field; // debug only
}
