import React, { useState } from 'react';
import { Box, Menu, MenuItem } from '@mui/material';

import { useCurrentItem } from '../../../EditContext';
import { t } from '../../../../../../services/intl';
import { EditorHeader } from './EditorHeader';
import { EditorItem, getLabel } from './EditorItem';

export const MultiValueKeyEditor: React.FC<{
  keys: string[];
  editableValues?: string[];
  label: string;
}> = ({ keys, editableValues = [], label }) => {
  const { tags, tagsEntries, setTag, setTagsEntries } = useCurrentItem();
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [visible, setVisible] = useState<string[]>(() =>
    keys.filter((k) => tags[k] !== undefined),
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const inactive = keys.filter((v) => !visible.includes(v));

  const handleAdd = (k: string) => {
    setVisible((prev) => [...prev, k]);
    if (tags[k] === undefined) {
      setTag(k, 'yes');
    }
    setAnchorEl(null);
  };

  const handleRemove = (key: string) => {
    const index = tagsEntries.findIndex(([k]) => k === key);
    if (index !== -1) setTagsEntries((prev) => prev.toSpliced(index, 1));
    setVisible((prev) => prev.filter((k) => k !== key));
  };

  const handleSwitch = (k: string, checked: boolean) => {
    setTag(k, checked ? 'yes' : 'no');
  };

  const handleCustomChange = (k: string, value: string) => {
    setTag(k, value.trim() === '' ? undefined : value);
  };

  const toggleEdit = (v: string) => {
    setEditing((prev) => ({ ...prev, [v]: !prev[v] }));
  };

  return (
    <Box>
      <EditorHeader
        label={label}
        inactive={inactive}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {inactive.map((k) => (
          <MenuItem key={k} onClick={() => handleAdd(k)}>
            {getLabel(k)}
          </MenuItem>
        ))}
        {inactive.length === 0 && (
          <MenuItem disabled>{t('editdialog.all_values_added')}</MenuItem>
        )}
      </Menu>

      <Box display="flex" flexDirection="column" gap={1} ml={1}>
        {visible.map((k) => (
          <EditorItem
            key={k}
            k={k}
            value={tags[k]}
            editable={editableValues.includes(k)}
            isEditing={editing[k]}
            onEditToggle={() => toggleEdit(k)}
            onSwitch={(checked) => handleSwitch(k, checked)}
            onRemove={() => handleRemove(k)}
            onCustomChange={(val) => handleCustomChange(k, val)}
          />
        ))}
      </Box>
    </Box>
  );
};
