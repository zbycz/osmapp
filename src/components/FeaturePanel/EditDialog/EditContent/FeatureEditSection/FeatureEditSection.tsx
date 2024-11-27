import { PresetSelect } from './PresetSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OptionsEditor } from './OptionsEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import React from 'react';

export function FeatureEditSection() {
  return (
    <>
      <PresetSelect />
      <MajorKeysEditor />
      <OptionsEditor />
      {/*<MembersEditor />*/}
      {/*<ParentsEditor />*/}
      <TagsEditor />
    </>
  );
}
