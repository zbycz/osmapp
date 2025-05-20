import { useCurrentItem } from '../EditContext';
import { ItemHeading } from './FeatureEditSection/ItemHeading';
import { PlaceCancelledToggle } from './FeatureEditSection/OptionsEditor';
import { PresetSelect } from './FeatureEditSection/PresetSelect/PresetSelect';
import { MajorKeysEditor } from './FeatureEditSection/MajorKeysEditor';
import { TagsEditor } from './FeatureEditSection/TagsEditor/TagsEditor';
import { LocationEditor } from './FeatureEditSection/LocationEditor/LocationEditor';
import { ParentsEditor } from './FeatureEditSection/ParentsEditor';
import { MembersEditor } from './FeatureEditSection/MembersEditor';
import React from 'react';

export const ItemEditSection = () => {
  const { toBeDeleted } = useCurrentItem();

  if (toBeDeleted) {
    return (
      <>
        <ItemHeading />
        <PlaceCancelledToggle />
      </>
    );
  }

  return (
    <>
      <ItemHeading />
      <PresetSelect />
      <MajorKeysEditor />
      <TagsEditor />
      <LocationEditor />
      <ParentsEditor />
      <MembersEditor />
    </>
  );
};
