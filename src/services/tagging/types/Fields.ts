// https://github.com/ideditor/schema-builder/blob/main/schemas/field.json

type FieldType =
  | 'access'
  | 'address'
  | 'check'
  | 'colour'
  | 'combo'
  | 'date'
  | 'defaultCheck'
  | 'directionalCombo'
  | 'email'
  | 'identifier'
  | 'lanes'
  | 'localized'
  | 'manyCombo'
  | 'multiCombo'
  | 'networkCombo'
  | 'number'
  | 'onewayCheck'
  | 'radio'
  | 'restrictions'
  | 'roadheight'
  | 'roadspeed'
  | 'semiCombo'
  | 'structureRadio'
  | 'tel'
  | 'text'
  | 'textarea'
  | 'typeCombo'
  | 'url'
  | 'wikidata'
  | 'wikipedia';

/**
 * A reusable form element for presets
 */
export type Field = {
  // added by osmapp (not in schema)
  fieldKey: string;

  /**
   * Tag key whose value is to be displayed
   * https://github.com/ideditor/schema-builder#keykeys
   */
  key?: string;
  /**
   * Tag keys whose value is to be displayed
   * https://github.com/ideditor/schema-builder#keykeys
   */
  keys?: string[];
  /**
   * Taginfo documentation parameters (to be used when a field manages multiple tags)
   */
  reference?:
    | {
        /**
         * For documentation of a key
         */
        key?: string;
        /**
         * For documentation of a tag (key and value)
         */
        value?: string;
      }
    | {
        /**
         * For documentation of a relation type
         */
        rtype?: string;
      };
  /**
   * Type of field
   */
  type?: FieldType;
  /**
   * English label for the field caption. A field can reference the label of another by using that field's identifier contained in brackets (e.g. {field}), in which case also the field's terms will be referenced from that field.
   */
  label?: string;
  /**
   * If specified, only show the field for these kinds of geometry
   */
  geometry?: [
    'point' | 'vertex' | 'line' | 'area' | 'relation', // minimal one entry
    ...('point' | 'vertex' | 'line' | 'area' | 'relation')[]
  ];
  /**
   * The default value for this field
   */
  default?: string;
  /**
   * List of untranslatable string suggestions (combo fields)
   */
  options?: string[];
  /**
   * If true, the top values from TagInfo will be suggested in the dropdown (combo fields only)
   */
  autoSuggestions?: boolean;
  /**
   * If true, the user can type their own value in addition to any listed in `options` or `strings.options` (combo fields only)
   */
  customValues?: boolean;
  /**
   * If true, this field will appear in the Add Field list for all presets
   */
  universal?: boolean;
  /**
   * Placeholder text for this field. A field can reference the placeholder text of another by using that field's identifier contained in brackets, like {field}.
   */
  placeholder?: string;
  /**
   * Strings sent to transifex for translation
   */
  strings?: {
    /**
     * Translatable options (combo fields).
     */
    options?: {
      [k: string]: unknown;
    };
    /**
     * Specialized fields can request translation of arbitrary strings
     */
    [k: string]: {
      [k: string]: unknown;
    };
  };
  /**
   * A field can reference strings of another by using that field's identifier contained in brackets, like {field}.
   */
  stringsCrossReference?: string;
  /**
   * If true, replace spaces with underscores in the tag value (combo fields only)
   */
  snake_case?: boolean;
  /**
   * If true, allow case sensitive field values (combo fields only)
   */
  caseSensitive?: boolean;
  /**
   * Minimum field value (number fields only)
   */
  minValue?: number;
  /**
   * Maximum field value (number fields only)
   */
  maxValue?: number;
  /**
   * The amount the stepper control should add or subtract (number fields only)
   */
  increment?: number;
  /**
   * Tagging constraint for showing this field in the editor
   */
  prerequisiteTag?:
    | {
        /**
         * The key of the required tag
         */
        key: string;
      }
    | {
        /**
         * The key of the required tag
         */
        key: string;
        /**
         * The value that the tag must have. (alternative to 'valueNot')
         */
        value: string;
      }
    | {
        /**
         * The key of the required tag
         */
        key: string;
        /**
         * The value that the tag cannot have. (alternative to 'value')
         */
        valueNot: string;
      }
    | {
        /**
         * A key that must not be present
         */
        keyNot: string;
      };
  /**
   * English synonyms or related search terms
   */
  terms?: string[];
  /**
   * An object specifying the IDs of regions where this field is or isn't valid. See: https://github.com/ideditor/location-conflation
   */
  locationSet?: {
    include?: string[];
    exclude?: string[];
  };
  /**
   * Permalink URL for `identifier` fields. Must contain a {value} placeholder
   */
  urlFormat?: string;
  /**
   * Regular expression that a valid `identifier` value is expected to match
   */
  pattern?: string;
  /**
   * The manner and context in which the field is used
   */
  usage?: 'preset' | 'changeset' | 'manual' | 'group';
  /**
   * For combo fields: Name of icons which represents different values of this field
   */
  icons?: {
    [k: string]: unknown;
  };
  /**
   * A field can reference icons of another by using that field's identifier contained in brackets, like {field}.
   */
  iconsCrossReference?: string;
};

export type Fields = {
  [fieldKey: string]: Field;
};
