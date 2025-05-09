export type NodeItemXml = {
  $: {
    id: number;
    lon: number;
    lat: number;
    version?: number;
    changeset: string;
  };
  tag: { $: { k: string; v: string } }[];
};
export type WayItemXml = {
  $: { id: number; version: number; changeset: string };
  tag: { $: { k: string; v: string } }[];
  nd: { $: { ref: number } }[];
};
export type RelationItemXml = {
  $: { id: number; version: number; changeset: string };
  tag: { $: { k: string; v: string } }[];
  member: { $: { type: string; ref: number; role: string } }[];
};

export type DiffDocXmljs = {
  $: { version: '0.6'; generator: 'OsmAPP' };
  create: {
    node: NodeItemXml[];
    way: WayItemXml[];
    relation: RelationItemXml[];
  };
  modify: {
    node: NodeItemXml[];
    way: WayItemXml[];
    relation: RelationItemXml[];
  };
  delete: {
    $: { 'if-unused': 'true' };
    node: NodeItemXml[];
    way: WayItemXml[];
    relation: RelationItemXml[];
  };
};

type OsmItemXmljs = {
  tag: { $: { k: string; v: string } }[];
  member?: { $: { type: string; ref: string; role: string } }[];
  $: {
    id: string;
    visible: string;
    version: string;
    changeset: string;
    timestamp: string;
    user: string;
    uid: string;
    lat: string;
    lon: string;
  };
};
export type SingleDocXmljs = {
  node: [OsmItemXmljs]; // only one osmType is present, but I am lazy to type it properly
  way: [OsmItemXmljs];
  relation: [OsmItemXmljs];
};
export type MultiDocXmljs = {
  node: OsmItemXmljs[]; // one or more may be present
  way: OsmItemXmljs[];
  relation: OsmItemXmljs[];
};

export type DiffResultItemXml = {
  $: {
    old_id: string;
    new_id: string;
    new_version: string;
  };
};

export type DiffResultXmljs = {
  node?: DiffResultItemXml[];
  way?: DiffResultItemXml[];
  relation?: DiffResultItemXml[];
};
