import { FeatureTags, LonLat } from '../../../../services/types';

export type TagsEntries = [string, string][];

export type Members = Array<{
  shortId: string;
  role: string;
  label: string; // cached from other dataItems, or from originalFeature
  // TODO rename to originalLabel - only to be used when member is not among editItems
}>;

// internal type stored in the state
export type DataItem = {
  shortId: string;
  version: number | undefined; // undefined for new item
  tagsEntries: TagsEntries;
  toBeDeleted: boolean;
  originalState: {
    tags: FeatureTags;
    isDeleted: boolean;
    nodeLonLat: LonLat | undefined;
    nodes: number[] | undefined;
    members: Members;
  };
  nodeLonLat?: LonLat; // only for nodes
  nodes?: number[]; // only for ways
  members?: Members; // only for relations
  relationClickedLonLat?: LonLat; // only for relations (converted from clicked node)
};

export type DataItemRaw = Omit<DataItem, 'originalState'>;

export type EditDataItem = DataItem & {
  setTagsEntries: SetTagsEntries;
  tags: FeatureTags;
  setTag: (k: string, v: string) => void;
  presetKey: string;
  presetLabel: string;
  setMembers: SetMembers;
  setShortId: SetShortId;
  setNodeLonLat: (lonLat: LonLat) => void;
  toggleToBeDeleted: () => void;
  convertToRelation: ConvertToRelation;
  modified: boolean;
};

export type ConvertToRelation = () => Promise<string>;

export type SetTagsEntries = (
  updateFn: (prev: TagsEntries) => TagsEntries,
) => void;

export type SetShortId = (shortId: string) => void;

export type SetMembers = (updateFn: (prev: Members) => Members) => void;
