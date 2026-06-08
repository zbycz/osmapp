import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useCurrentItem } from '../../../context/EditContext';
import { getFields } from '../../../../../../services/tagging/fields';
import { allPresets } from '../../../../../../services/tagging/data';
import { Field } from '../../../../../../services/tagging/types/Fields';
import { Preset } from '../../../../../../services/tagging/types/Presets';
import { FeatureTags } from '../../../../../../services/types';
import { t } from '../../../../../../services/intl';
import { FieldItem } from './FieldItem';
import { getPrimaryKey } from './helpers';

const hasValue = (field: Field, tags: FeatureTags): boolean => {
  if (field.key && tags[field.key]) return true;
  if (field.keys?.some((key) => tags[key])) return true;
  // multiCombo prefix keys, e.g. recycling:glass=yes
  const prefix = getPrimaryKey(field);
  if (prefix?.endsWith(':')) {
    return Object.keys(tags).some((key) => key.startsWith(prefix));
  }
  return false;
};

const FieldsEditorInner = ({ preset }: { preset: Preset }) => {
  const { tags } = useCurrentItem();
  const { fields, moreFields } = getFields(preset);

  // fields that already have a value (or are part of the preset) are shown,
  // the rest are offered as "add field" buttons
  const allFields = [...fields, ...moreFields];
  const [extraFields, setExtraFields] = useState<Field[]>([]);

  const activeFields = allFields.filter(
    (field) =>
      fields.includes(field) ||
      hasValue(field, tags) ||
      extraFields.includes(field),
  );
  const inactiveFields = allFields.filter(
    (field) => !activeFields.includes(field),
  );

  return (
    <Box mb={3}>
      {activeFields.map((field) => (
        <FieldItem key={field.fieldKey} field={field} />
      ))}

      {!!inactiveFields.length && (
        <Box mt={1}>
          <Typography variant="body1" component="span" color="textSecondary">
            {t('editdialog.add_major_tag')}:
          </Typography>{' '}
          {inactiveFields.map((field) => (
            <Button
              key={field.fieldKey}
              size="small"
              onClick={() => setExtraFields((arr) => [...arr, field])}
            >
              {field.fieldTranslation?.label ?? `[${field.fieldKey}]`}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export const FieldsEditor = () => {
  const { presetKey } = useCurrentItem();

  const preset = presetKey ? allPresets[presetKey] : undefined;
  if (!preset) {
    return null;
  }

  return <FieldsEditorInner preset={preset} />;
};
