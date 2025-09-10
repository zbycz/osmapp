import React, { useEffect, useState } from 'react';
import { getApiId } from '../../../../../services/helpers';
import { useCurrentItem, useEditContext } from '../../context/EditContext';
import { Button, IconButton, TextareaAutosize, TextField } from '@mui/material';
import { FeatureTags } from '../../../../../services/types';
import { t } from '../../../../../services/intl';
import AddIcon from '@mui/icons-material/Add';
import { getPresetTranslation } from '../../../../../services/tagging/translations';
import { fetchFreshItem, getNewNodeItem } from '../../context/itemsHelpers';
import { DataItem, Members } from '../../context/types';
import { getPresetKey } from '../../context/utils';
import { Setter } from '../../../../../types';
import styled from '@emotion/styled';
import { GradeSystemSelect } from '../../../Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../../../../utils/userSettings/UserSettingsContext';
import { GRADE_TABLE } from '../../../../../services/tagging/climbing/gradeData';
import { getOsmTagFromGradeSystem } from '../../../../../services/tagging/climbing/routeGrade';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CloseIcon from '@mui/icons-material/Close';

export type Scene = null | 'single' | 'batch';

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

const parseGradeFromLine = (line: string, gradeSystem?: string) => {
  if (!gradeSystem) {
    return { gradeTags: {}, name: line };
  }

  const grades = GRADE_TABLE[gradeSystem];
  const words = line.split(' ');
  const lastWord = words[words.length - 1];
  if (grades.includes(lastWord)) {
    return {
      gradeTags: {
        [getOsmTagFromGradeSystem(gradeSystem)]: lastWord,
      },
      name: line.substring(0, line.length - lastWord.length - 1),
    };
  }

  return { gradeTags: {}, name: line };
};

const convertLine = async (
  line: string,
  parentTags: FeatureTags,
  gradeSystem: string,
) => {
  let newItem: DataItem;
  if (line.match(/^[nwr]\d+$/)) {
    const apiId = getApiId(line);
    newItem = await fetchFreshItem(apiId);
  } else {
    const { gradeTags, name } = parseGradeFromLine(line, gradeSystem);
    newItem = getNewNodeItem(undefined, {
      name,
      ...getMemberTags(parentTags),
      ...gradeTags,
    });
  }

  // TODO this code could be removed, if we lookup the label in render among editItems
  const presetKey = getPresetKey(newItem);
  const presetLabel = getPresetTranslation(presetKey);
  const tags = Object.fromEntries(newItem.tagsEntries);
  const newLabel = tags.name ?? presetLabel;
  const newMember = { shortId: newItem.shortId, role: '', label: newLabel };

  return { newItem, newMember };
};

const useGetGradeSystemOrUndefined = (scene: string) => {
  const relation = useCurrentItem();
  const { userSettings } = useUserSettingsContext();
  if (scene === 'batch' && relation.tags.climbing) {
    return userSettings['climbing.gradeSystem'] ?? 'uiaa';
  }
  return undefined;
};

const useHandleAddMember = (
  scene: string,
  setScene: Setter<Scene>,
  label: string,
  setLabel: Setter<string>,
) => {
  const { addItem, setCurrent } = useEditContext();
  const relation = useCurrentItem();
  const gradeSystem = useGetGradeSystemOrUndefined(scene);

  return async (e: React.MouseEvent) => {
    const lines = label.split('\n').filter(Boolean);
    const newMembers: Members = [];

    for (const line of lines) {
      const { tags } = relation;
      const { newItem, newMember } = await convertLine(line, tags, gradeSystem);
      addItem(newItem);
      newMembers.push(newMember);
    }

    relation.setMembers((prev) => [...(prev ?? []), ...newMembers]);
    setScene(null);
    setLabel('');

    if (newMembers.length && (e.ctrlKey || e.metaKey)) {
      setCurrent(newMembers[0].shortId);
    }
  };
};

const StyledFormatListBulletedIcon = styled(FormatListBulletedIcon)`
  font-size: 16px;
`;
export const BatchButton = ({ onClick }: { onClick: () => void }) => (
  <div>
    <IconButton onClick={onClick}>
      <StyledFormatListBulletedIcon />
    </IconButton>
  </div>
);

const StyledCloseIcon = styled(CloseIcon)`
  font-size: 16px;
`;
export const CancelButton = (props: {
  setLabel: Setter<string>;
  setScene: Setter<Scene>;
}) => (
  <div>
    <IconButton
      onClick={() => {
        props.setLabel('');
        props.setScene(null);
      }}
    >
      <StyledCloseIcon />
    </IconButton>
  </div>
);

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
  label: string;
  setLabel: Setter<string>;
}) => (
  <TextField
    value={props.label}
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
      if (scene !== 'single') {
        return;
      }

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

const StyledTextareaAutosize = styled(TextareaAutosize)`
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  width: 50%;
`;

const BatchTextarea = (props: { label: string; setLabel: Setter<string> }) => {
  const { tags } = useCurrentItem();
  const { userSettings } = useUserSettingsContext();
  const gradeSystem = userSettings['climbing.gradeSystem'] ?? 'uiaa';
  const grades = GRADE_TABLE[gradeSystem];
  const example = grades[24];
  const placeholder = tags.climbing
    ? `Cat in a Hat ${example}\n...`
    : 'name\n...';

  return (
    <>
      <StyledTextareaAutosize
        minRows={3}
        value={props.label}
        placeholder={placeholder}
        onChange={(e) => props.setLabel(e.target.value)}
      />
      {tags.climbing ? <GradeSystemSelect /> : null}
    </>
  );
};

export const AddMemberForm = () => {
  const [scene, setScene] = useState<Scene>();
  const [label, setLabel] = useState('');
  const handleAddMember = useHandleAddMember(scene, setScene, label, setLabel);
  useKeyboardShortcuts(handleAddMember, scene, setScene);

  return (
    <>
      {scene === 'single' ? (
        <>
          <MemberNameInput label={label} setLabel={setLabel} />
          <ConfirmButton onClick={handleAddMember} />
          <BatchButton onClick={() => setScene('batch')} />
        </>
      ) : scene === 'batch' ? (
        <>
          <BatchTextarea label={label} setLabel={setLabel} />
          <ConfirmButton onClick={handleAddMember} />
          <CancelButton setLabel={setLabel} setScene={setScene} />
        </>
      ) : (
        <ShowFormButton onClick={() => setScene('single')} />
      )}
    </>
  );
};
