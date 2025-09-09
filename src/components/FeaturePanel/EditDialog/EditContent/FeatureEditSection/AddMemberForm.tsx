import React, { useCallback, useEffect, useState } from 'react';
import { getApiId } from '../../../../../services/helpers';
import { useCurrentItem, useEditContext } from '../../context/EditContext';
import { Button, IconButton, TextField } from '@mui/material';
import { FeatureTags } from '../../../../../services/types';
import { t } from '../../../../../services/intl';
import AddIcon from '@mui/icons-material/Add';
import { getPresetTranslation } from '../../../../../services/tagging/translations';
import { fetchFreshItem, getNewNodeItem } from '../../context/itemsHelpers';
import { DataItem } from '../../context/types';
import { getPresetKey } from '../../context/utils';
import { Setter } from '../../../../../types';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import styled from '@emotion/styled';

type Scene = null | 'single' | 'batch';

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

const useHandleAddMember = (setScene: Setter<Scene>) => {
  const { addItem, setCurrent } = useEditContext();
  const relation = useCurrentItem();
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
      setScene(null);
      setLabel('');
      if (e.ctrlKey || e.metaKey) {
        setCurrent(newShortId);
      }
    },
    [relation, label, addItem, setScene, setCurrent],
  );
  return { label, setLabel, handleAddMember };
};

const ShowFormButton = (props: { onClick: () => void }) => {
  const relation = useCurrentItem();
  const isClimbingCrag = relation.tags.climbing === 'crag';
  return (
    <Button startIcon={<AddIcon />} onClick={props.onClick} variant="text">
      {isClimbingCrag
        ? t('editdialog.members.add_climbing_route')
        : t('editdialog.members.add_member')}
    </Button>
  );
};

const ConfirmButton = (props: { onClick: (e) => Promise<void> }) => (
  <Button onClick={props.onClick} variant="text">
    {t('editdialog.members.confirm')}
  </Button>
);

const MemberNameInput = (props: {
  value: string;
  setLabel: Setter<string>;
}) => (
  <TextField
    value={props.value}
    size="small"
    label={t('editdialog.members.name')}
    onChange={(e) => {
      props.setLabel(e.target.value);
    }}
    autoFocus
  />
);

const useKeyboardShortcuts = (
  handleAddMember: (e) => Promise<void>,
  scene: Scene,
  setScene: Setter<Scene>,
) => {
  useEffect(() => {
    const downHandler = (e) => {
      if (!scene) return;

      if (e.key === 'Enter') {
        handleAddMember(e);
      }

      if (e.key === 'Escape') {
        setScene(null);
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [handleAddMember, setScene, scene]);
};

const StyledFormatListBulletedIcon = styled(FormatListBulletedIcon)`
  font-size: 16px;
`;

const BatchButton = ({ onClick }: { onClick: () => void }) => (
  <div>
    <IconButton onClick={onClick}>
      <StyledFormatListBulletedIcon />
    </IconButton>
  </div>
);

export const AddMemberForm = () => {
  const [scene, setScene] = useState<Scene>();
  const { label, setLabel, handleAddMember } = useHandleAddMember(setScene);
  useKeyboardShortcuts(handleAddMember, scene, setScene);

  return (
    <>
      {scene === 'single' ? (
        <>
          <MemberNameInput value={label} setLabel={setLabel} />
          <ConfirmButton onClick={handleAddMember} />
          {/*<BatchButton onClick={() => setScene('batch')} />*/}
        </>
      ) : (
        // ) : scene === 'batch' ? (
        //   <BatchScene />
        <ShowFormButton onClick={() => setScene('single')} />
      )}
    </>
  );
};
