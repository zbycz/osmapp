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
