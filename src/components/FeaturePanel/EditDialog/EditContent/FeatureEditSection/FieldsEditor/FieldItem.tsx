import React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { Field } from '../../../../../../services/tagging/types/Fields';
import { getFieldTranslation } from '../../../../../../services/tagging/translations';
import { useCurrentItem } from '../../../context/EditContext';
import { useEditDialogContext } from '../../../../helpers/EditDialogContext';
import { OpeningHoursEditor } from '../OpeningHoursEditor/OpeningHoursEditor';
import { FieldInput } from './FieldInput';
import { getFieldOptions, getPrimaryKey } from './helpers';
import { useFieldsEditorDebug } from './featureFlag';

const Row = styled.div`
  margin-bottom: 4px;
`;

export const FieldItem = ({ field }: { field: Field }) => {
  const { tags, setTag } = useCurrentItem();
  const { focusTag } = useEditDialogContext();
  const debug = useFieldsEditorDebug();

  const key = getPrimaryKey(field);

  // opening_hours has its own rich editor in this app
  if (key === 'opening_hours') {
    return <OpeningHoursEditor />;
  }

  const fieldTranslation = field.fieldTranslation ?? getFieldTranslation(field);
  const label = fieldTranslation?.label ?? `[${field.fieldKey}]`;
  const options = getFieldOptions(field, fieldTranslation);

  return (
    <Row>
      <FieldInput
        field={field}
        tags={tags}
        setTag={setTag}
        label={label}
        options={options}
        autoFocus={focusTag === key}
      />
      {debug && (
        <Typography
          variant="caption"
          component="div"
          sx={{ fontFamily: 'monospace', opacity: 0.6 }}
        >
          {field.fieldKey} · type:{field.type ?? 'text'} · key:{key}
        </Typography>
      )}
    </Row>
  );
};
