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
import dynamic from 'next/dynamic';
import { Stack, Typography } from '@mui/material';
import { getOsmTypeFromShortId, NwrIcon } from '../../../NwrIcon';

const EditFeatureMapDynamic = dynamic(
  () => import('./EditFeatureMap/EditFeatureMap'),
  {
    ssr: false,
    loading: () => <div />,
  },
);

type Props = {
  shortId: string;
};

const EditFeatureHeading = () => {
  const { shortId, tags, presetLabel } = useFeatureEditData();

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6">{tags.name || presetLabel || ' '}</Typography>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Typography variant="caption" color="secondary">
          {shortId}
        </Typography>
        <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
      </Stack>
    </Stack>
  );
};

export const FeatureEditSection = ({ shortId }: Props) => (
  <SingleFeatureEditContextProvider shortId={shortId}>
    <EditFeatureHeading />
    <PresetSelect />
    <MajorKeysEditor />
    <TagsEditor />
    <EditFeatureMapDynamic />
    <ParentsEditor />
    <MembersEditor />
  </SingleFeatureEditContextProvider>
);
