import { FeatureTags, LonLat } from '../../../../services/types';

export type TagsEntries = [string, string][];

export type Member = {
  shortId: string;
  role: string;
  originalLabel?: string; // only shown when member is not among editItems
};
export type Members = Member[];

export type Section = 'climbing' | 'location' | 'parents' | 'members' | 'tags';

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
  sections: Section[];
  nodeLonLat?: LonLat; // only for nodes (may be undefined until user selects the location)
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
  setSections: SetSections;
};

export type ConvertToRelation = () => Promise<string>;

export type SetTagsEntries = (
  updateFn: (prev: TagsEntries) => TagsEntries,
) => void;

export type SetShortId = (shortId: string) => void;

export type SetMembers = (updateFn: (prev: Members) => Members) => void;

export type SetSections = (updateFn: (prev: Section[]) => Section[]) => void;
