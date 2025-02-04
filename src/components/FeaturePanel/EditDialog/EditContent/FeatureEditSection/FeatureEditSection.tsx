import React from 'react';
import dynamic from 'next/dynamic';
import { PresetSelect } from './PresetSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import { CurrentContextProvider } from './CurrentContext';
import { MembersEditor } from './MembersEditor';
import { ParentsEditor } from './ParentsEditor';
import { EditFeatureHeading } from './EditFeatureHeading';

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

export const FeatureEditSection = ({ shortId }: Props) => (
  <CurrentContextProvider shortId={shortId}>
    <EditFeatureHeading />
    <PresetSelect />
    <MajorKeysEditor />
    <TagsEditor />
    <EditFeatureMapDynamic />
    <ParentsEditor />
    <MembersEditor />
  </CurrentContextProvider>
);
