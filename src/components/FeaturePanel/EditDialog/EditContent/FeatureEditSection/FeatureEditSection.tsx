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

const EditFeatureMapDynamic = dynamic(
  () => import('./EditFeatureMap/EditFeatureMap'),
  {
    ssr: false,
    loading: () => <div />,
  },
);
import { Stack, Typography } from '@mui/material';
import { useEditContext } from '../../EditContext';
import { getOsmTypeFromShortId, NwrIcon } from '../../../NwrIcon';

type Props = {
  shortId: string;
};

const EditFeatureHeading = (props: { shortId: string }) => {
  const { items } = useEditContext();
  const { tags } = useFeatureEditData();

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6">{tags.name || ' '}</Typography>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Typography variant="caption" color="secondary">
          {props.shortId}
        </Typography>
        <NwrIcon osmType={getOsmTypeFromShortId(props.shortId)} />
      </Stack>
    </Stack>
  );
};

export const FeatureEditSection = ({ shortId }: Props) => (
  <SingleFeatureEditContextProvider shortId={shortId}>
    <EditFeatureHeading shortId={shortId} />
    <PresetSelect />
    <MajorKeysEditor />
    <TagsEditor />
    <EditFeatureMapDynamic />
    <ParentsEditor />
    <MembersEditor />
  </SingleFeatureEditContextProvider>
);
