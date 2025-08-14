import React, { useState } from 'react';
import { Box, Menu, MenuItem } from '@mui/material';

import { useCurrentItem } from '../../../EditContext';
import { t } from '../../../../../../services/intl';
import { TranslationId } from '../../../../../../services/types';
import { EditorHeader } from './EditorHeader';
import { EditorItem, getLabel } from './EditorItem';

const getFullKey = (baseKey: string, value: string) => `${baseKey}:${value}`;
const getBaseSuffix = (baseKey: string) => baseKey.replace(':', '_');

export const MultiValueKeyEditor: React.FC<{
  baseKey: string;
  translationKey?: string;
  values: string[];
  editableValues?: string[];
}> = ({ baseKey, values, editableValues = [], translationKey }) => {
  const { tags, tagsEntries, setTag, setTagsEntries } = useCurrentItem();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
    values.filter((v) => tags[getFullKey(baseKey, v)] !== undefined),
  );
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const translationSuffix = getBaseSuffix(translationKey ?? baseKey);
  const baseSuffix = translationKey;
  const open = Boolean(anchorEl);

  const isEditable = (v: string) => editableValues.includes(v);
  const inactive = values.filter((v) => !visibleKeys.includes(v));

  const handleAdd = (v: string) => {
    const key = getFullKey(baseKey, v);
    setVisibleKeys((prev) => [...prev, v]);
    if (tags[key] === undefined) setTag(key, 'yes');
    setAnchorEl(null);
  };

  const handleRemove = (v: string) => {
    const key = getFullKey(baseKey, v);
    const index = tagsEntries.findIndex(([k]) => k === key);
    if (index !== -1) setTagsEntries((prev) => prev.toSpliced(index, 1));
    setVisibleKeys((prev) => prev.filter((i) => i !== v));
  };

  const handleSwitch = (v: string, checked: boolean) => {
    setTag(getFullKey(baseKey, v), checked ? 'yes' : 'no');
  };

  const handleCustomChange = (v: string, value: string) => {
    const key = getFullKey(baseKey, v);
    setTag(key, value.trim() === '' ? undefined : value);
  };

  const toggleEdit = (v: string) => {
    setEditing((prev) => ({ ...prev, [v]: !prev[v] }));
  };

  return (
    <Box>
      <EditorHeader
        label={t(`${translationSuffix}_label` as TranslationId)} // TODO TranslationId should never be dynamic, see https://github.com/zbycz/osmapp/pull/1229/files#r2276510504
        inactive={inactive}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {inactive.map((v) => (
          <MenuItem key={v} onClick={() => handleAdd(v)}>
            {getLabel(baseSuffix, v)}
          </MenuItem>
        ))}
        {inactive.length === 0 && (
          <MenuItem disabled>{t('editdialog.all_values_added')}</MenuItem>
        )}
      </Menu>

      <Box display="flex" flexDirection="column" gap={1} ml={1}>
        {visibleKeys.map((v) => (
          <EditorItem
            key={v}
            baseSuffix={baseSuffix}
            valueKey={v}
            value={tags[getFullKey(baseKey, v)]}
            editable={isEditable(v)}
            isEditing={editing[v]}
            onEditToggle={() => toggleEdit(v)}
            onSwitch={(checked) => handleSwitch(v, checked)}
            onRemove={() => handleRemove(v)}
            onCustomChange={(val) => handleCustomChange(v, val)}
          />
        ))}
      </Box>
    </Box>
  );
};
