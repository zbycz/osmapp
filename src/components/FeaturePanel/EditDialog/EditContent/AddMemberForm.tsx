import { EditDataItem, Members } from '../useEditItems';
import { getApiId, getShortId } from '../../../../services/helpers';
import { getOsmElement } from '../../../../services/osm/quickFetchFeature';
import { useEditContext } from '../EditContext';
import { useFeatureEditData } from './FeatureEditSection/SingleFeatureEditContext';
import React, { useCallback } from 'react';
import { getNewNode } from '../../../../services/getCoordsFeature';
import { Alert, Button, TextField } from '@mui/material';
import { LonLat, OsmId } from '../../../../services/types';
import { t } from '../../../../services/intl';
import AddIcon from '@mui/icons-material/Add';
import { NwrIcon } from '../../NwrIcon';

const hasAtLeastOneNode = (members: Members) => {
  return members?.some((member) => member.shortId.startsWith('n'));
};

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
    throw new Error('No node found');
  }
  const lonLat = await getLastNodeLocation(osmId, items);
  return lonLat.map((x) => x + 0.0001);
};

const defaultRouteBottomTags = {
  climbing: 'route_bottom',
  sport: 'climbing',
};

export const AddMemberForm = ({
  newLonLat,
  selectedPresetKey,
}: {
  newLonLat?: LonLat;
  selectedPresetKey?: string;
}) => {
  const getDefaultTags = useCallback(
    () => ({
      ...(selectedPresetKey === 'climbing/route_bottom'
        ? defaultRouteBottomTags
        : {}),
    }),
    [selectedPresetKey],
  );
  const defaultTags = getDefaultTags();

  const { addFeature, items, setCurrent, current } = useEditContext();
  const { members, setMembers, tags, setShortId } = useFeatureEditData();
  const [showInput, setShowInput] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const isClimbingCrag = tags.climbing === 'crag';

  const handleAddMember = useCallback(async () => {
    const lastNodeLocation =
      newLonLat ?? (await getNewNodeLocation(items, members));
    const newNode = getNewNode(lastNodeLocation, label, defaultTags);
    const newShortId = getShortId(newNode.osmMeta);
    addFeature(newNode);
    setMembers((prev) => [
      ...(prev ?? []),
      { shortId: newShortId, role: '', label },
    ]);
    setShowInput(false);
    setLabel('');
    setCurrent(newShortId);
  }, [
    addFeature,
    defaultTags,
    items,
    label,
    members,
    newLonLat,
    setCurrent,
    setMembers,
  ]);

  React.useEffect(() => {
    const downHandler = (e) => {
      if (!showInput) return;

      if (e.key === 'Enter') {
        handleAddMember();
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

  if (!hasAtLeastOneNode(members) && !newLonLat) {
    return; // TODO so far, we need a node (with coordinates) for adding a new node
  }

  const convertToRelation = () => {
    const newShortId = current.replace(/n/, 'r');
    setShortId(newShortId);
    setCurrent(newShortId);
  };

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
              onClick={convertToRelation}
              color="inherit"
              variant="text"
              size="small"
              startIcon={<NwrIcon osmType="relation" color="inherit" />}
            >
              {t('editdialog.members.convert_button')}
            </Button>
          }
        >
          {t('editdialog.members.convert_description')}
        </Alert>
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setShowInput(true)}
          variant="text"
        >
          {t('editdialog.members.add_member')}
        </Button>
      )}
    </>
  );
};
