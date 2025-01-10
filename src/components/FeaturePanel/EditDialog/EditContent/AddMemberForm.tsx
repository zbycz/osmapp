import { EditDataItem, Members } from '../useEditItems';
import { getApiId, getShortId } from '../../../../services/helpers';
import { getOsmElement } from '../../../../services/osm/quickFetchFeature';
import { useEditContext } from '../EditContext';
import { useFeatureEditData } from './FeatureEditSection/SingleFeatureEditContext';
import React from 'react';
import { getNewNode } from '../../../../services/getCoordsFeature';
import { Button, TextField } from '@mui/material';
import { OsmId } from '../../../../services/types';

const hasAtLeastOneNode = (members: Members) => {
  return members.some((member) => member.shortId.startsWith('n'));
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

export const AddMemberForm = () => {
  const { addFeature, items } = useEditContext();
  const { members, setMembers } = useFeatureEditData();
  const [showInput, setShowInput] = React.useState(false);
  const [label, setLabel] = React.useState('');

  if (!hasAtLeastOneNode(members)) {
    return; // TODO so far, we need a node (with coordinates) for adding a new node
  }

  const handleAddMember = async () => {
    const lastNodeLocation = await getNewNodeLocation(items, members);
    const newNode = getNewNode(lastNodeLocation, label);
    addFeature(newNode);
    setMembers((prev) => [
      ...prev,
      { shortId: getShortId(newNode.osmMeta), role: '', label },
    ]);
    setShowInput(false);
    setLabel('');
  };

  return (
    <>
      {showInput ? (
        <>
          <TextField
            value={label}
            size="small"
            label="Name"
            onChange={(e) => {
              setLabel(e.target.value);
            }}
          />
          <Button onClick={handleAddMember} variant="text">
            Add node
          </Button>
        </>
      ) : (
        <Button onClick={() => setShowInput(true)} variant="text">
          Add
        </Button>
      )}
    </>
  );
};
