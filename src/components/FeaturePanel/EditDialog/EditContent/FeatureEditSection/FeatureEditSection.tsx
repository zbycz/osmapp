import { PresetSelect } from './PresetSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import React from 'react';
import { SingleFeatureEditContextProvider } from './SingleFeatureEditContext';
import { MembersEditor } from '../MembersEditor';
import { ParentsEditor } from '../ParentsEditor';

type Props = {
  shortId: string;
};

export const FeatureEditSection = ({ shortId }: Props) => (
  <SingleFeatureEditContextProvider shortId={shortId}>
    <PresetSelect />
    <MajorKeysEditor />
    <TagsEditor />
    <ParentsEditor />
    <MembersEditor />
  </SingleFeatureEditContextProvider>
);
