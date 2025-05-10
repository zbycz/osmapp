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
import React, { useCallback } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import { LonLat, OsmId } from '../../../../../services/types';
import { t } from '../../../../../services/intl';
import AddIcon from '@mui/icons-material/Add';
import { NwrIcon } from '../../../NwrIcon';
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
  sport: 'climbing',
  climbing: 'route_bottom',
};
const getDefaultTags = (selectedPresetKey: string) => {
  return selectedPresetKey === 'climbing/route_bottom' ? ROUTE_BOTTOM_TAGS : {};
};

export const AddMemberForm = ({
  newLonLat,
  selectedPresetKey,
}: {
  newLonLat?: LonLat;
  selectedPresetKey?: string;
}) => {
  const { view } = useMapStateContext();
  const { addNewItem, items, setCurrent, current } = useEditContext();
  const { members, setMembers, tags, convertToRelation } = useCurrentItem();
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
          newLonLat ?? (await getNewNodeLocation(items, members)) ?? viewPoint;
        const defaultTags = getDefaultTags(selectedPresetKey);
        newItem = getNewNodeItem(newNodePosition, {
          name: label,
          ...defaultTags,
        });
      }

      const newShortId = newItem.shortId;

      // TODO this code could be removed, if we lookup the label in render among editItems
      const presetKey = getPresetKey(newItem);
      const presetLabel = getPresetTranslation(presetKey);
      const tags = Object.fromEntries(newItem.tagsEntries);
      const newLabel = tags.name ?? presetLabel;

      addNewItem(newItem);

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
    [
      addNewItem,
      items,
      label,
      members,
      newLonLat,
      selectedPresetKey,
      setCurrent,
      setMembers,
      view,
    ],
  );

  React.useEffect(() => {
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

  const handleConvertToRelation = async () => {
    const newShortId = await convertToRelation();
    setCurrent(newShortId);
  };

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
      ) : isClimbingCrag && getApiId(current).type === 'node' ? (
        <Alert
          severity="info"
          icon={null}
          action={
            <Button
              onClick={handleConvertToRelation}
              color="inherit"
              variant="text"
              size="small"
              startIcon={<NwrIcon osmType="relation" color="inherit" />}
            >
              {t('editdialog.members.convert_button')}
            </Button>
          }
        >
          {isClimbingCrag
            ? t('editdialog.members.climbing_crag_convert_description')
            : t('editdialog.members.convert_description')}
        </Alert>
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
