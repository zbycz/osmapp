import { DataItem } from '../../../../components/FeaturePanel/EditDialog/useEditItems';
import { getDiffXml } from '../getDIffXml';

const nodeNew: DataItem = {
  shortId: 'n-1',
  version: undefined,
  tagsEntries: [['newNode', 'yes']],
  members: undefined,
  nodes: undefined,
  nodeLonLat: [14, 50],
  toBeDeleted: false,
};

const nodeChange: DataItem = {
  shortId: 'n2222',
  version: 2,
  tagsEntries: [['addedTags', 'yes']],
  members: undefined,
  nodes: undefined,
  nodeLonLat: [14, 50],
  toBeDeleted: false,
};

const nodeToDelete: DataItem = {
  shortId: 'n9999',
  version: 9,
  tagsEntries: [],
  members: undefined,
  nodes: undefined,

  nodeLonLat: [14, 50],
  toBeDeleted: true,
};

const nodesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<osmChange generator="OsmAPP" version="0.6">
  <create>
    <node id="-1" lon="14" lat="50" version="0" changeset="123">
      <tag k="newNode" v="yes"/>
    </node>
  </create>
  <modify>
    <node id="2222" lon="14" lat="50" version="2" changeset="123">
      <tag k="addedTags" v="yes"/>
    </node>
  </modify>
  <delete if-unused="true">
    <node id="9999" lon="14" lat="50" version="9" changeset="123"/>
  </delete>
</osmChange>`;

test('should convert nodes', () => {
  expect(getDiffXml('123', [nodeNew, nodeChange, nodeToDelete])).toEqual(
    nodesXml,
  );
});

const wayNew: DataItem = {
  shortId: 'w-1',
  version: undefined,
  tagsEntries: [['newWay', 'yes']],
  members: undefined,
  nodes: [4001, 4002, 4003],
  nodeLonLat: undefined,
  toBeDeleted: false,
};

const wayChange: DataItem = {
  shortId: 'w2222',
  version: 2,
  tagsEntries: [['addedTags', 'yes']],
  members: undefined,
  nodes: [4001, 4002, 4003],
  nodeLonLat: undefined,
  toBeDeleted: false,
};

const wayToDelete: DataItem = {
  shortId: 'w9999',
  version: 9,
  tagsEntries: [],
  members: undefined,
  nodes: [4001, 4002, 4003],
  nodeLonLat: undefined,
  toBeDeleted: true,
};

const waysXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<osmChange generator="OsmAPP" version="0.6">
  <create>
    <way id="-1" version="0" changeset="123">
      <tag k="newWay" v="yes"/>
      <nd ref="4001"/>
      <nd ref="4002"/>
      <nd ref="4003"/>
    </way>
  </create>
  <modify>
    <way id="2222" version="2" changeset="123">
      <tag k="addedTags" v="yes"/>
      <nd ref="4001"/>
      <nd ref="4002"/>
      <nd ref="4003"/>
    </way>
  </modify>
  <delete if-unused="true">
    <way id="9999" version="9" changeset="123">
      <nd ref="4001"/>
      <nd ref="4002"/>
      <nd ref="4003"/>
    </way>
  </delete>
</osmChange>`;

test('should convert ways', () => {
  expect(getDiffXml('123', [wayNew, wayChange, wayToDelete])).toEqual(waysXml);
});

const relationNew: DataItem = {
  shortId: 'r-1',
  version: undefined,
  tagsEntries: [['new', 'yes']],
  members: [
    { shortId: 'n-1', role: 'role', label: 'x' },
    { shortId: 'w-2', role: 'role', label: 'y' },
  ],
  nodes: undefined,
  nodeLonLat: undefined,
  toBeDeleted: false,
};

const relationChange: DataItem = {
  shortId: 'r22',
  version: 2,
  tagsEntries: [['changed', 'yes']],
  members: [{ shortId: 'n-1', role: 'role', label: 'x' }],
  nodes: undefined,
  nodeLonLat: undefined,
  toBeDeleted: false,
};

const relationToDelete: DataItem = {
  shortId: 'r99',
  version: 9,
  tagsEntries: [],
  members: [],
  nodes: undefined,
  nodeLonLat: undefined,
  toBeDeleted: true,
};

const relationsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<osmChange generator="OsmAPP" version="0.6">
  <create>
    <relation id="-1" version="0" changeset="123">
      <tag k="new" v="yes"/>
      <member type="node" ref="-1" role="role"/>
      <member type="way" ref="-2" role="role"/>
    </relation>
  </create>
  <modify>
    <relation id="22" version="2" changeset="123">
      <tag k="changed" v="yes"/>
      <member type="node" ref="-1" role="role"/>
    </relation>
  </modify>
  <delete if-unused="true">
    <relation id="99" version="9" changeset="123"/>
  </delete>
</osmChange>`;

test('should convert relations', () => {
  expect(
    getDiffXml('123', [relationNew, relationChange, relationToDelete]),
  ).toEqual(relationsXml);
});
