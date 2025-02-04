import React from 'react';
import { PresetSelect } from './PresetSelect';
import { MajorKeysEditor } from './MajorKeysEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import { CurrentContextProvider } from './CurrentContext';
import { MembersEditor } from './MembersEditor';
import { ParentsEditor } from './ParentsEditor';
import { ItemHeading } from './ItemHeading';
import { LocationEditor } from './LocationEditor/LocationEditor';

type Props = {
  shortId: string;
};

export const ItemEditSection = ({ shortId }: Props) => (
  <CurrentContextProvider shortId={shortId}>
    <ItemHeading />
    <PresetSelect />
    <MajorKeysEditor />
    <TagsEditor />
    <LocationEditor />
    <ParentsEditor />
    <MembersEditor />
  </CurrentContextProvider>
);
