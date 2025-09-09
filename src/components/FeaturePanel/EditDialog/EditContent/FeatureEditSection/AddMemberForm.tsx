import { useState } from 'react';
import { getApiId } from '../../../../../services/helpers';
import { useCurrentItem, useEditContext } from '../../context/EditContext';
import React, { useCallback, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { FeatureTags } from '../../../../../services/types';
import { t } from '../../../../../services/intl';
import AddIcon from '@mui/icons-material/Add';
import { getPresetTranslation } from '../../../../../services/tagging/translations';
import { fetchFreshItem, getNewNodeItem } from '../../context/itemsHelpers';
import { DataItem } from '../../context/types';
import { getPresetKey } from '../../context/utils';

const ROUTE_BOTTOM_TAGS = {
  climbing: 'route_bottom',
  sport: 'climbing',
};
const CRAG_TAGS = {
  climbing: 'crag',
  sport: 'climbing',
};
const getMemberTags = (parentTags: FeatureTags) => {
  if (parentTags.climbing === 'crag') {
    return ROUTE_BOTTOM_TAGS;
  }
  if (parentTags.climbing === 'area') {
    return CRAG_TAGS;
  }
  return {};
};

// TODO refactor

export const AddMemberForm = () => {
  const { addItem, setCurrent } = useEditContext();
  const relation = useCurrentItem();
  const [showInput, setShowInput] = useState(false);
  const [label, setLabel] = useState('');

  const handleAddMember = useCallback(
    async (e) => {
      const { setMembers, tags } = relation;

      let newItem: DataItem;
      if (label.match(/^[nwr]\d+$/)) {
        const apiId = getApiId(label);
        newItem = await fetchFreshItem(apiId);
      } else {
        newItem = getNewNodeItem(undefined, {
          name: label,
          ...getMemberTags(tags),
        });
      }

      const newShortId = newItem.shortId;

      // TODO this code could be removed, if we lookup the label in render among editItems
      const presetKey = getPresetKey(newItem);
      const presetLabel = getPresetTranslation(presetKey);
      const tags2 = Object.fromEntries(newItem.tagsEntries);
      const newLabel = tags2.name ?? presetLabel;

      addItem(newItem);

      setMembers((prev) => [
        ...(prev ?? []),
        { shortId: newShortId, role: '', label: newLabel },
      ]);
      setShowInput(false);
      setLabel('');
      if (e.ctrlKey || e.metaKey) {
        setCurrent(newShortId);
      }
    },
    [addItem, relation, label, setCurrent],
  );

  useEffect(() => {
    const downHandler = (e) => {
      if (!showInput) return;

      if (e.key === 'Enter') {
        handleAddMember(e);
      }

      if (e.key === 'Escape') {
        setShowInput(false);
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [handleAddMember, showInput]);

  const isClimbingCrag = relation.tags.climbing === 'crag';

  return (
    <>
      {showInput ? (
        <>
          <TextField
            value={label}
            size="small"
            label={t('editdialog.members.name')}
            onChange={(e) => {
              setLabel(e.target.value);
            }}
          />

          <Button onClick={handleAddMember} variant="text">
            {t('editdialog.members.confirm')}
          </Button>
        </>
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setShowInput(true)}
          variant="text"
        >
          {isClimbingCrag
            ? t('editdialog.members.add_climbing_route')
            : t('editdialog.members.add_member')}
        </Button>
      )}
    </>
  );
};
