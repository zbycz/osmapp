import { PresetSelect } from './PresetSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import React from 'react';
import {
  SingleFeatureEditContextProvider,
  useFeatureEditData,
} from './SingleFeatureEditContext';
import { MembersEditor } from '../MembersEditor';
import { ParentsEditor } from '../ParentsEditor';
import { Stack, Typography } from '@mui/material';
import { useEditContext } from '../../EditContext';

type Props = {
  shortId: string;
};

const EditFeatureHeading = (props: { shortId: string }) => {
  const { items } = useEditContext();
  const { tags } = useFeatureEditData();

  if (items.length <= 1) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6">{tags.name || ' '}</Typography>
      <Typography variant="caption" color="secondary">
        {props.shortId}
      </Typography>
    </Stack>
  );
};

export const FeatureEditSection = ({ shortId }: Props) => (
  <SingleFeatureEditContextProvider shortId={shortId}>
    <EditFeatureHeading shortId={shortId} />
    <PresetSelect />
    <MajorKeysEditor />
    <TagsEditor />
    <ParentsEditor />
    <MembersEditor />
  </SingleFeatureEditContextProvider>
);
