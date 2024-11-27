import { PresetSelect } from './PresetSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OptionsEditor } from './OptionsEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import React from 'react';
import { OsmId } from '../../../../../services/types';
import { SingleFeatureEditContextProvider } from './SingleFeatureEditContext';

type Props = {
  featureId: OsmId;
};

export const FeatureEditSection = ({ featureId }: Props) => (
  <SingleFeatureEditContextProvider featureId={featureId}>
    <PresetSelect />
    <MajorKeysEditor />
    <OptionsEditor />
    {/*<MembersEditor />*/}
    {/*<ParentsEditor />*/}
    <TagsEditor />
  </SingleFeatureEditContextProvider>
);
