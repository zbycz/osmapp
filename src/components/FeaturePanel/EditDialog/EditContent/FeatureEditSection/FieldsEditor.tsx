import { useCurrentItem } from '../../EditContext';
import { getFields } from '../../../../../services/tagging/fields';
import { getFieldTranslation } from '../../../../../services/tagging/translations';
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { FeatureTags } from '../../../../../services/types';
import { Field } from '../../../../../services/tagging/types/Fields';
import { t } from '../../../../../services/intl';
import { allPresets } from '../../../../../services/tagging/data';
import { Preset } from '../../../../../services/tagging/types/Presets';
import styled from '@emotion/styled';
import { OpeningHoursEditor } from './OpeningHoursEditor/OpeningHoursEditor';
import { useEditDialogContext } from '../../../helpers/EditDialogContext';

const StyledFormControl = styled(FormControl)`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const StyledRow = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const getInitialActiveFields = (
  fields: Field[],
  tags: FeatureTags,
): Field[] => {
  const activeFields = [];
  fields.forEach((field: Field) => {
    if (tags[field.key]) {
      activeFields.push(field);
    }
  });

  return activeFields;
};

const FieldInput = ({ field }: { field: Field }) => {
  const { tags, setTag } = useCurrentItem();
  const fieldKey = field.fieldKey;
  const fieldTranslation = getFieldTranslation(field);
  const label = `${fieldTranslation?.label ?? `[${fieldKey}]`} – fieldkey:${fieldKey} – type:${field.type}`;
  const k = field.key ?? field.keys?.[0];

  // console.log({ k, label, field, fieldTranslation });

  const [value, setValue] = useState<string | null>();
  const [inputValue, setInputValue] = React.useState(tags[k]);

  if (fieldKey === 'opening_hours') {
    return <OpeningHoursEditor key={fieldKey} />;
  }

  const options = Object.entries(fieldTranslation.options ?? {}).map(
    ([key, value]) => ({ id: key, label: JSON.stringify(value) }),
  );

  // combo -- field.customValue == true/false
  // TODO use standard Select (as commented below), and just add a custom element readonly / placeholder when option not found

  return (
    <StyledRow>
      <Autocomplete
        value={value}
        onChange={(event: any, newValue: string | null) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue: string) => {
          setInputValue(newInputValue);
        }}
        filterOptions={(option) => option}
        freeSolo
        disablePortal
        disableClearable
        options={options}
        fullWidth
        renderInput={(params) => (
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label={label}
            {...params}
          />
        )}
      />{' '}
      Tag: <code>{k}</code> value: <code>{JSON.stringify(value)}</code>
      <pre>{JSON.stringify(options, null, 2).substring(0, 100)}</pre>
    </StyledRow>
  );

  // if (field.type === 'combo') {
  //   return (
  //     <StyledFormControl key={fieldKey} fullWidth>
  //       <InputLabel shrink>{label}</InputLabel>
  //       <Select
  //         label={label}
  //         value={tags[k]}
  //         onChange={(e) => setTag(k, e.target.value)}
  //         displayEmpty
  //         variant="outlined"
  //       >
  //         {Object.entries(fieldTranslation.options ?? {}).map(
  //           ([key, value]) => (
  //             <MenuItem key={key} value={key}>
  //               {value}
  //             </MenuItem>
  //           ),
  //         )}
  //       </Select>
  //     </StyledFormControl>
  //   );
  // }

  if (field.type === 'semiCombo') {
    const values = tags[k]?.split(';') ?? [];
    return (
      <StyledFormControl key={fieldKey} fullWidth>
        <InputLabel shrink>{label}</InputLabel>
        <Select
          label={label}
          multiple
          value={values}
          onChange={(e) => setTag(k, (e.target.value as string[]).join(';'))}
          renderValue={(selected) => selected.join(', ')}
          displayEmpty
          fullWidth
          variant="outlined"
        >
          {field.options?.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={values.includes(option)} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    );
  }

  return (
    <div key={fieldKey}>
      <TextField
        label={label}
        value={tags[k]}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        margin="normal"
        name={k}
        onChange={(e) => setTag(e.target.name, e.target.value)}
        fullWidth
        // autoFocus={focusTag === k}
      />
    </div>
  );
};

const FieldsEditorInner = ({ preset }: { preset: Preset }) => {
  const { tags, setTag } = useCurrentItem();

  const { fields, moreFields, universalFields } = getFields(preset); // TODO
  const [activeFields, setActiveFields] = useState(() =>
    getInitialActiveFields(fields, tags),
  );
  const inactiveFields = fields.filter(
    ({ fieldKey }) => !activeFields.some((f) => f.fieldKey === fieldKey),
  );

  return (
    <>
      {activeFields.map((field) => {
        return <FieldInput key={field.fieldKey} field={field} />;
      })}

      {!!inactiveFields.length && (
        <>
          <Typography variant="body1" component="span" color="textSecondary">
            {t('editdialog.add_major_tag')}:
          </Typography>
          {inactiveFields.map((field) => {
            const fieldTranslation = getFieldTranslation(field);
            const label = fieldTranslation?.label ?? `[${field.fieldKey}]`;

            return (
              <React.Fragment key={field.fieldKey}>
                {' '}
                <Button
                  size="small"
                  onClick={() => setActiveFields((arr) => [...arr, field])}
                >
                  {label}
                </Button>
              </React.Fragment>
            );
          })}
        </>
      )}
      <br />
      <br />
    </>
  );
};

export const FieldsEditor = () => {
  const { focusTag } = useEditDialogContext();
  const { presetKey } = useCurrentItem();

  // TODO remove condition
  if (!presetKey) {
    return null;
  }

  const preset = allPresets[presetKey];
  if (!preset) {
    return null;
  }

  return <FieldsEditorInner preset={preset} />;
};
