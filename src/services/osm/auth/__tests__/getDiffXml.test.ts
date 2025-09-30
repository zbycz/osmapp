import { getDiffXml } from '../getDIffXml';
import { DataItem } from '../../../../components/FeaturePanel/EditDialog/context/types';

const nodeNew = {
  shortId: 'n-1',
  version: undefined,
  tagsEntries: [['newNode', 'yes']],
  toBeDeleted: false,
  nodeLonLat: [14, 50],
} as DataItem;

const nodeChange = {
  shortId: 'n2222',
  version: 2,
  tagsEntries: [['addedTags', 'yes']],
  toBeDeleted: false,
  nodeLonLat: [14, 50],
} as DataItem;

const nodeToDelete = {
  shortId: 'n9999',
  version: 9,
  tagsEntries: [],
  toBeDeleted: true,
  nodeLonLat: [14, 50],
} as DataItem;

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
  expect(getDiffXml([nodeNew, nodeChange, nodeToDelete], '123')).toEqual(
    nodesXml,
  );
});

const wayNew = {
  shortId: 'w-1',
  version: undefined,
  tagsEntries: [['newWay', 'yes']],
  toBeDeleted: false,
  nodes: [4001, 4002, 4003],
} as DataItem;

const wayChange = {
  shortId: 'w2222',
  version: 2,
  tagsEntries: [['addedTags', 'yes']],
  toBeDeleted: false,
  nodes: [4001, 4002, 4003],
} as DataItem;

const wayToDelete = {
  shortId: 'w9999',
  version: 9,
  tagsEntries: [],
  toBeDeleted: true,
  nodes: [4001, 4002, 4003],
} as DataItem;

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
  expect(getDiffXml([wayNew, wayChange, wayToDelete], '123')).toEqual(waysXml);
});

const relationNew = {
  shortId: 'r-1',
  version: undefined,
  tagsEntries: [['new', 'yes']],
  toBeDeleted: false,
  members: [
    { shortId: 'n-1', role: 'role' },
    { shortId: 'w-2', role: 'role' },
  ],
} as DataItem;

const relationChange = {
  shortId: 'r22',
  version: 2,
  tagsEntries: [['changed', 'yes']],
  toBeDeleted: false,
  members: [{ shortId: 'n-1', role: 'role', originalLabel: 'ignored' }],
} as DataItem;

const relationToDelete = {
  shortId: 'r99',
  version: 9,
  tagsEntries: [],
  toBeDeleted: true,
  members: [],
} as DataItem;

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
    getDiffXml([relationNew, relationChange, relationToDelete], '123'),
  ).toEqual(relationsXml);
});
