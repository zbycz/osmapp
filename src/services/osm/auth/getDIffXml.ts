import { DataItem } from '../../../components/FeaturePanel/EditDialog/useEditItems';
import { getApiId } from '../../helpers';
import {
  DiffDocXmljs,
  NodeItemXml,
  RelationItemXml,
  WayItemXml,
} from './xmlTypes';
import { xmljsBuildOsmChange } from './xmlHelpers';

const isNode = ({ shortId }: DataItem) => shortId.startsWith('n');
const isWay = ({ shortId }: DataItem) => shortId.startsWith('w');
const isRelation = ({ shortId }: DataItem) => shortId.startsWith('r');

const TAG = ([k, v]: [string, string]) => k && v;

const nodeItemToXml = (change: DataItem, changeset: string): NodeItemXml => {
  const { shortId, version = 0, tagsEntries, nodeLonLat } = change;
  const { id } = getApiId(shortId);
  const [lon, lat] = nodeLonLat;

  return {
    $: { id, lon, lat, version, changeset },
    tag: tagsEntries.filter(TAG).map(([k, v]) => ({ $: { k, v } })),
  };
};

const wayItemToXml = (change: DataItem, changeset: string): WayItemXml => {
  const { shortId, version = 0, tagsEntries, nodes } = change;
  const { id } = getApiId(shortId);

  if (!nodes) {
    throw new Error(`No nodes found for item: way/${id}`);
  }

  return {
    $: { id, version, changeset },
    tag: tagsEntries.filter(TAG).map(([k, v]) => ({ $: { k, v } })),
    nd: nodes.map((ref) => ({ $: { ref } })),
  };
};

const relationItemToXml = (
  change: DataItem,
  changeset: string,
): RelationItemXml => {
  const { shortId, version = 0, tagsEntries, members } = change;
  const { id } = getApiId(shortId);

  return {
    $: { id, version, changeset },
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
  create: isNew,
  delete: isDeleted,
  modify: (item: DataItem) => !isNew(item) && !isDeleted(item),
};

const getXmlByAction = (
  changes: DataItem[],
  action: 'create' | 'modify' | 'delete',
  changesetId: string,
) => {
  const items = changes.filter(condition[action]);
  return {
    node: items.filter(isNode).map((node) => nodeItemToXml(node, changesetId)),
    way: items.filter(isWay).map((way) => wayItemToXml(way, changesetId)),
    relation: items
      .filter(isRelation)
      .map((relation) => relationItemToXml(relation, changesetId)),
  };
};

export const getDiffXml = (
  changesetId: string,
  changes: DataItem[],
): string => {
  const xml: DiffDocXmljs = {
    $: { generator: 'OsmAPP', version: '0.6' },
    create: getXmlByAction(changes, 'create', changesetId),
    modify: getXmlByAction(changes, 'modify', changesetId),
    delete: {
      $: { 'if-unused': 'true' },
      ...getXmlByAction(changes, 'delete', changesetId),
    },
  };

  return xmljsBuildOsmChange(xml);
};
