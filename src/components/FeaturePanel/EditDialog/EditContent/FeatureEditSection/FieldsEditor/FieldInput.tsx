import React from 'react';
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { Field } from '../../../../../../services/tagging/types/Fields';
import { FeatureTags } from '../../../../../../services/types';
import { FieldOption, getPrimaryKey } from './helpers';

export type FieldInputProps = {
  field: Field;
  tags: FeatureTags;
  setTag: (key: string, value: string) => void;
  label: string;
  options: FieldOption[];
  autoFocus?: boolean;
};

const Group = styled.fieldset`
  margin: 8px 0 0;
  padding: 0;
  border: none;
  display: block;
`;

const labelFor = (options: FieldOption[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

// ---- text-like inputs ------------------------------------------------------

const HTML_INPUT_TYPE: Partial<Record<string, string>> = {
  number: 'number',
  tel: 'tel',
  email: 'email',
  url: 'url',
};

const TextInput = ({
  field,
  tags,
  setTag,
  label,
  autoFocus,
}: FieldInputProps) => {
  const key = getPrimaryKey(field);
  const multiline = field.type === 'textarea';
  return (
    <TextField
      label={label}
      value={tags[key] ?? ''}
      onChange={(e) => setTag(key, e.target.value)}
      type={HTML_INPUT_TYPE[field.type] ?? 'text'}
      placeholder={field.placeholder}
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      margin="normal"
      fullWidth
      autoFocus={autoFocus}
    />
  );
};

const ColourSwatch = styled.input`
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
`;

const ColourInput = (props: FieldInputProps) => {
  const { field, tags, setTag } = props;
  const key = getPrimaryKey(field);
  const value = tags[key] ?? '';
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextInput {...props} />
      <ColourSwatch
        type="color"
        aria-label={`${props.label} colour picker`}
        value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'}
        onChange={(e) => setTag(key, e.target.value)}
      />
    </Stack>
  );
};

// ---- combos ----------------------------------------------------------------

const ComboInput = ({
  field,
  tags,
  setTag,
  label,
  options,
  autoFocus,
}: FieldInputProps) => {
  const key = getPrimaryKey(field);
  const current = tags[key] ?? '';
  const selected =
    options.find((o) => o.value === current) ??
    (current ? { value: current, label: current } : null);
  const freeSolo = field.customValues !== false;

  return (
    <Autocomplete
      value={selected}
      onChange={(_e, newValue) =>
        setTag(
          key,
          typeof newValue === 'string' ? newValue : (newValue?.value ?? ''),
        )
      }
      options={options}
      getOptionLabel={(o) => (typeof o === 'string' ? o : o.label)}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      freeSolo={freeSolo}
      autoSelect={freeSolo}
      selectOnFocus
      handleHomeEndKeys
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="normal"
          autoFocus={autoFocus}
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  );
};

const SemiComboInput = ({
  field,
  tags,
  setTag,
  label,
  options,
}: FieldInputProps) => {
  const key = getPrimaryKey(field);
  const values = tags[key] ? tags[key].split(';') : [];
  return (
    <Autocomplete
      multiple
      freeSolo
      value={values}
      onChange={(_e, newValues) =>
        setTag(key, (newValues as string[]).join(';'))
      }
      options={options.map((o) => o.value)}
      getOptionLabel={(o) => labelFor(options, o)}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  );
};

// multiCombo: a single prefix key (e.g. `recycling:`) expands into many
// boolean tags like `recycling:glass=yes`
const MultiComboInput = ({
  field,
  tags,
  setTag,
  label,
  options,
}: FieldInputProps) => {
  const prefix = getPrimaryKey(field);
  return (
    <Group>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup row>
        {options.map((option) => {
          const key = `${prefix}${option.value}`;
          return (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={tags[key] === 'yes'}
                  onChange={(e) => setTag(key, e.target.checked ? 'yes' : '')}
                />
              }
              label={option.label}
            />
          );
        })}
      </FormGroup>
    </Group>
  );
};

// manyCombo: a fixed list of boolean keys (e.g. bus=yes, tram=yes)
const ManyComboInput = ({
  field,
  tags,
  setTag,
  label,
  options,
}: FieldInputProps) => {
  const keys = field.keys ?? [];
  return (
    <Group>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup row>
        {keys.map((key, index) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={tags[key] === 'yes'}
                onChange={(e) => setTag(key, e.target.checked ? 'yes' : '')}
              />
            }
            label={options[index]?.label ?? key}
          />
        ))}
      </FormGroup>
    </Group>
  );
};

// ---- checks ----------------------------------------------------------------

const CheckInput = ({
  field,
  tags,
  setTag,
  label,
  options,
}: FieldInputProps) => {
  const key = getPrimaryKey(field);
  const choices = options.length
    ? options
    : [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ];
  const value = tags[key] ?? '';
  return (
    <Group>
      <FormLabel>{label}</FormLabel>
      <div>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={value}
          onChange={(_e, newValue) => setTag(key, newValue ?? '')}
        >
          {choices.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </Group>
  );
};

// ---- radios ----------------------------------------------------------------

// radio with a single key: foo=value
const RadioInput = ({
  field,
  tags,
  setTag,
  label,
  options,
}: FieldInputProps) => {
  const key = getPrimaryKey(field);
  return (
    <Group>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row
        value={tags[key] ?? ''}
        onChange={(e) => setTag(key, e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </Group>
  );
};

// structureRadio (and radio with multiple keys): pick one of several boolean
// keys, e.g. bridge=yes / tunnel=yes / none
const KeysRadioInput = ({
  field,
  tags,
  setTag,
  label,
  options,
}: FieldInputProps) => {
  const keys = field.keys ?? [];
  const active = keys.find((key) => tags[key] && tags[key] !== 'no') ?? '';
  const onChange = (chosen: string) => {
    keys.forEach((key) => {
      if (key === chosen) {
        setTag(key, tags[key] && tags[key] !== 'no' ? tags[key] : 'yes');
      } else if (tags[key]) {
        setTag(key, '');
      }
    });
  };
  return (
    <Group>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row value={active} onChange={(e) => onChange(e.target.value)}>
        <FormControlLabel value="" control={<Radio />} label="—" />
        {keys.map((key, index) => (
          <FormControlLabel
            key={key}
            value={key}
            control={<Radio />}
            label={options[index]?.label ?? key}
          />
        ))}
      </RadioGroup>
    </Group>
  );
};

// ---- composite fields ------------------------------------------------------

// access / directionalCombo: render a combo for each sub-key, sharing options
const SubKeyCombos = (props: FieldInputProps) => {
  const { field, label } = props;
  const subKeys = [field.key, ...(field.keys ?? [])].filter(
    (key, index, arr): key is string => !!key && arr.indexOf(key) === index,
  );
  return (
    <Group>
      <FormLabel component="legend">{label}</FormLabel>
      {subKeys.map((key) => (
        <ComboInput
          key={key}
          {...props}
          label={key}
          field={{ ...field, key, keys: undefined }}
        />
      ))}
    </Group>
  );
};

const ADDRESS_SUBKEYS = [
  'addr:housenumber',
  'addr:street',
  'addr:city',
  'addr:postcode',
  'addr:country',
];

const AddressInput = ({ tags, setTag, label }: FieldInputProps) => (
  <Group>
    <FormLabel component="legend">{label}</FormLabel>
    {ADDRESS_SUBKEYS.map((key) => (
      <TextField
        key={key}
        label={key.replace('addr:', '')}
        value={tags[key] ?? ''}
        onChange={(e) => setTag(key, e.target.value)}
        InputLabelProps={{ shrink: true }}
        margin="dense"
        size="small"
        fullWidth
      />
    ))}
  </Group>
);

// localized: main value + any name:xx variants already present
const LocalizedInput = (props: FieldInputProps) => {
  const { field, tags, setTag, label } = props;
  const key = getPrimaryKey(field);
  const localizedKeys = Object.keys(tags).filter((k) =>
    k.startsWith(`${key}:`),
  );
  return (
    <Group>
      <TextInput {...props} label={label} />
      {localizedKeys.map((localizedKey) => (
        <TextField
          key={localizedKey}
          label={localizedKey}
          value={tags[localizedKey] ?? ''}
          onChange={(e) => setTag(localizedKey, e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="dense"
          size="small"
          fullWidth
        />
      ))}
    </Group>
  );
};

const RestrictionsInput = ({ label }: FieldInputProps) => (
  <Group>
    <FormLabel>{label}</FormLabel>
    <Typography variant="body2" color="textSecondary">
      Turn restrictions are edited on the map (not supported here yet).
    </Typography>
  </Group>
);

// ---- dispatcher ------------------------------------------------------------

export const FieldInput = (props: FieldInputProps) => {
  switch (props.field.type) {
    case 'colour':
      return <ColourInput {...props} />;

    case 'combo':
    case 'typeCombo':
    case 'networkCombo':
      return <ComboInput {...props} />;

    case 'semiCombo':
      return <SemiComboInput {...props} />;

    case 'multiCombo':
      return <MultiComboInput {...props} />;

    case 'manyCombo':
      return <ManyComboInput {...props} />;

    case 'check':
    case 'defaultCheck':
    case 'onewayCheck':
      return <CheckInput {...props} />;

    case 'radio':
      // some radio fields use multiple boolean keys instead of one value
      return props.field.key ? (
        <RadioInput {...props} />
      ) : (
        <KeysRadioInput {...props} />
      );

    case 'structureRadio':
      return <KeysRadioInput {...props} />;

    case 'access':
    case 'directionalCombo':
      return <SubKeyCombos {...props} />;

    case 'address':
      return <AddressInput {...props} />;

    case 'localized':
      return <LocalizedInput {...props} />;

    case 'restrictions':
      return <RestrictionsInput {...props} />;

    // text, textarea, number, tel, email, url, identifier, date, roadspeed,
    // roadheight, wikidata, wikipedia and anything unknown
    default:
      return <TextInput {...props} />;
  }
};
