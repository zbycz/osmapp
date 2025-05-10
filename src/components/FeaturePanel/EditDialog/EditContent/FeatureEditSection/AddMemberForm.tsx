import {
  DataItem,
  EditDataItem,
  getPresetKey,
  Members,
} from '../../useEditItems';
import { getApiId, getShortId } from '../../../../../services/helpers';
import { getOsmElement } from '../../../../../services/osm/quickFetchFeature';
import { useEditContext } from '../../EditContext';
import { useCurrentItem } from './CurrentContext';
import React, { useCallback, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { FeatureTags, OsmId } from '../../../../../services/types';
import { t } from '../../../../../services/intl';
import AddIcon from '@mui/icons-material/Add';
import { useMapStateContext } from '../../../../utils/MapStateContext';
import { getPresetTranslation } from '../../../../../services/tagging/translations';
import { fetchFreshItem, getNewNodeItem } from '../../itemsHelpers';

const getLastNodeApiId = (members: Members) => {
  const lastNode = members
    .toReversed()
    .find((member) => member.shortId.startsWith('n'));
  return lastNode ? getApiId(lastNode.shortId) : null;
};

const findItem = (items: EditDataItem[], osmId: OsmId) =>
  items.find((item) => item.shortId === getShortId(osmId));

const getLastNodeLocation = async (osmId: OsmId, items: EditDataItem[]) => {
  if (osmId.id < 0) {
    return findItem(items, osmId)?.nodeLonLat;
  }
  const element = await getOsmElement(osmId);
  return [element.lon, element.lat];
};

const getNewNodeLocation = async (items: EditDataItem[], members: Members) => {
  const osmId = getLastNodeApiId(members);
  if (!osmId) {
    return undefined;
  }
  const lonLat = await getLastNodeLocation(osmId, items);
  return lonLat.map((x) => x + 0.0001);
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

export const AddMemberForm = () => {
  const { view } = useMapStateContext();
  const { addItem, items, setCurrent } = useEditContext();
  const { members, setMembers, tags } = useCurrentItem();
  const [showInput, setShowInput] = React.useState(false);
  const [label, setLabel] = React.useState('');

  const handleAddMember = useCallback(
    async (e) => {
      let newItem: DataItem;

      if (label.match(/^[nwr]\d+$/)) {
        const apiId = getApiId(label);
        newItem = await fetchFreshItem(apiId);
      } else {
        const [z, lat, lon] = view;
        const viewPoint = [parseFloat(lon), parseFloat(lat)];
        const newNodePosition =
          (await getNewNodeLocation(items, members)) ?? viewPoint;
        newItem = getNewNodeItem(newNodePosition, {
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
      if (!e.ctrlKey && !e.metaKey) {
        setCurrent(newShortId);
      }
    },
    [addItem, items, label, members, setCurrent, setMembers, tags, view],
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

  const isClimbingCrag = tags.climbing === 'crag';

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
