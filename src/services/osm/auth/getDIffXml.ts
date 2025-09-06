import { getApiId } from '../../helpers';
import {
  DiffDocXmljs,
  NodeItemXml,
  RelationItemXml,
  WayItemXml,
} from './xmlTypes';
import { xmljsBuildOsmChange } from './xmlHelpers';
import { DataItem } from '../../../components/FeaturePanel/EditDialog/context/types';

const isNode = ({ shortId }: DataItem) => shortId.startsWith('n');
const isWay = ({ shortId }: DataItem) => shortId.startsWith('w');
const isRelation = ({ shortId }: DataItem) => shortId.startsWith('r');

const TAG = ([k, v]: [string, string]) => k && v;

type Changeset = {} | { changeset: string };

const nodeItemToXml = (change: DataItem, changeset: Changeset): NodeItemXml => {
  const { shortId, version = 0, tagsEntries, nodeLonLat } = change;
  const { id } = getApiId(shortId);
  const [lon, lat] = nodeLonLat;

  return {
    $: { id, lon, lat, version, ...changeset },
    tag: tagsEntries.filter(TAG).map(([k, v]) => ({ $: { k, v } })),
  };
};

const wayItemToXml = (change: DataItem, changeset: Changeset): WayItemXml => {
  const { shortId, version = 0, tagsEntries, nodes } = change;
  const { id } = getApiId(shortId);

  if (!nodes) {
    throw new Error(`No nodes found for item: way/${id}`);
  }

  return {
    $: { id, version, ...changeset },
    tag: tagsEntries.filter(TAG).map(([k, v]) => ({ $: { k, v } })),
    nd: nodes.map((ref) => ({ $: { ref } })),
  };
};

const relationItemToXml = (
  change: DataItem,
  changeset: Changeset,
): RelationItemXml => {
  const { shortId, version = 0, tagsEntries, members } = change;
  const { id } = getApiId(shortId);

  return {
    $: { id, version, ...changeset },
    tag: tagsEntries.filter(TAG).map(([k, v]) => ({ $: { k, v } })),
    member: members.map(({ shortId, role }) => {
      const { type, id } = getApiId(shortId);
      return { $: { type, ref: id, role } };
    }),
  };
};

const isNew = ({ shortId }: DataItem) => shortId.includes('-');
const isDeleted = ({ toBeDeleted }: DataItem) => toBeDeleted;
const condition = {
  _ignore_: (item: DataItem) => isNew(item) && isDeleted(item),
  create: (item: DataItem) => isNew(item) && !isDeleted(item),
  delete: (item: DataItem) => !isNew(item) && isDeleted(item),
  modify: (item: DataItem) => !isNew(item) && !isDeleted(item),
};

const getXmlByAction = (
  changes: DataItem[],
  action: 'create' | 'modify' | 'delete',
  changeset: Changeset,
) => {
  const items = changes.filter(condition[action]);
  return {
    node: items.filter(isNode).map((node) => nodeItemToXml(node, changeset)),
    way: items.filter(isWay).map((way) => wayItemToXml(way, changeset)),
    relation: items
      .filter(isRelation)
      .toReversed() // new relation can be referenced by another only above, but OSM needs the reference beforehand
      .map((relation) => relationItemToXml(relation, changeset)),
  };
};

export const getDiffXml = (
  changes: DataItem[],
  changesetId?: string,
): string => {
  const changeset = changesetId ? { changeset: changesetId } : {};

  const xml: DiffDocXmljs = {
    $: { generator: 'OsmAPP', version: '0.6' },
    create: getXmlByAction(changes, 'create', changeset),
    modify: getXmlByAction(changes, 'modify', changeset),
    delete: {
      $: { 'if-unused': 'true' },
      ...getXmlByAction(changes, 'delete', changeset),
    },
  };

  return xmljsBuildOsmChange(xml);
};
