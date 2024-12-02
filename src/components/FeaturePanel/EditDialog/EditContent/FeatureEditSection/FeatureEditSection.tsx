import { PresetSelect } from './PresetSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OptionsEditor } from './OptionsEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import React from 'react';
import { OsmId } from '../../../../../services/types';
import { SingleFeatureEditContextProvider } from './SingleFeatureEditContext';

type Props = {
  shortId: string;
};

export const FeatureEditSection = ({ shortId }: Props) => (
  <SingleFeatureEditContextProvider shortId={shortId}>
    <PresetSelect />
    <MajorKeysEditor />
    <OptionsEditor />
    {/*<MembersEditor />*/}
    {/*<ParentsEditor />*/}
    <TagsEditor />
  </SingleFeatureEditContextProvider>
);
