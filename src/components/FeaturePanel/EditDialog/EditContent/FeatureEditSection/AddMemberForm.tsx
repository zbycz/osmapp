import { useState } from 'react';
import {
  DataItem,
  EditDataItem,
  getPresetKey,
  Members,
} from '../../useEditItems';
import { getApiId } from '../../../../../services/helpers';
import { getOsmElement } from '../../../../../services/osm/quickFetchFeature';
import { useCurrentItem, useEditContext } from '../../EditContext';
import React, { useCallback, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { FeatureTags, LonLat } from '../../../../../services/types';
import { t } from '../../../../../services/intl';
import AddIcon from '@mui/icons-material/Add';
import { useMapStateContext, View } from '../../../../utils/MapStateContext';
import { getPresetTranslation } from '../../../../../services/tagging/translations';
import { fetchFreshItem, getNewNodeItem } from '../../itemsHelpers';

const getLastNode = (members: Members) => {
  const lastNode = members
    .toReversed()
    .find((member) => member.shortId.startsWith('n'));
  return lastNode ? lastNode.shortId : null;
};

const findItem = (items: EditDataItem[], shortId: string) =>
  items.find((item) => item.shortId === shortId);

const isNew = (shortId: string) => shortId.includes('-');

const getLastNodeLocation = async (shortId: string, items: EditDataItem[]) => {
  const lastNode = findItem(items, shortId);
  if (lastNode) {
    return lastNode.nodeLonLat;
  }
  if (!isNew(shortId)) {
    const element = await getOsmElement(getApiId(shortId));
    return [element.lon, element.lat];
  }
  return null;
};

const getNextNodeLocation = async (items: EditDataItem[], members: Members) => {
  const lastNode = getLastNode(members);
  if (!lastNode) {
    return undefined;
  }
  const lonLat = await getLastNodeLocation(lastNode, items);
  return lonLat?.map((x) => x + 0.0001);
};

const getViewPoint = (view: View): LonLat => {
  const [_, lat, lon] = view;
  return [parseFloat(lon), parseFloat(lat)];
};

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
  const { view } = useMapStateContext();
  const { addItem, items, setCurrent } = useEditContext();
  const currentItem = useCurrentItem();
  const [showInput, setShowInput] = useState(false);
  const [label, setLabel] = useState('');

  const handleAddMember = useCallback(
    async (e) => {
      const { members, setMembers, tags, nodeLonLat } = currentItem;

      let newItem: DataItem;
      if (label.match(/^[nwr]\d+$/)) {
        const apiId = getApiId(label);
        newItem = await fetchFreshItem(apiId);
      } else {
        const nextPosition = await getNextNodeLocation(items, members);
        const position = nextPosition ?? nodeLonLat ?? getViewPoint(view); // nodeLonLat for relation converted from node
        newItem = getNewNodeItem(position, {
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
    [addItem, currentItem, items, label, setCurrent, view],
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

  const isClimbingCrag = currentItem.tags.climbing === 'crag';

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
