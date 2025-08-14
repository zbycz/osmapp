import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useCurrentItem } from '../../../EditContext';
import { EditorHeader } from './EditorHeader';
import { EditorItem } from './EditorItem';

export const MultiValueKeyEditor: React.FC<{
  keys: string[];
  editableValues?: string[];
  label: string;
}> = ({ keys, editableValues = [], label }) => {
  const { tags } = useCurrentItem();
  const [visible, setVisible] = useState<string[]>(() =>
    keys.filter((k) => tags[k] !== undefined),
  );
  const inactive = keys.filter((k) => !visible.includes(k));

  return (
    <>
      <EditorHeader label={label} inactive={inactive} setVisible={setVisible} />
      <Box display="flex" flexDirection="column" gap={1} ml={1}>
        {visible.map((k) => (
          <EditorItem
            key={k}
            k={k}
            setVisible={setVisible}
            editable={editableValues.includes(k)}
          />
        ))}
      </Box>
    </>
  );
};
