import escape from 'lodash/escape';
import {
  Feature,
  FeatureTags,
  LonLat,
  OsmId,
  Position,
  SuccessInfo,
} from '../types';
import {
  getApiId,
  getFullOsmappLink,
  getShortId,
  getUrlOsmId,
} from '../helpers';
import { join } from '../../utils';
import { clearFetchCache } from '../fetchCache';
import { getLabel } from '../../helpers/featureLabel';
import {
  EditDataItem,
  Members,
} from '../../components/FeaturePanel/EditDialog/useEditItems';
import { OSM_WEBSITE } from './consts';
import { SingleDocXmljs } from './auth/xmlTypes';
import { parseToXmljs, xmljsBuildOsm } from './auth/xmlHelpers';
import * as api from './auth/api';
import zipObject from 'lodash/zipObject';

export const getChangesetXml = ({ changesetComment, feature }) => {
  const tags = [
    ['created_by', `OsmAPP ${process.env.osmappVersion}`],
    ['comment', changesetComment],
    ['submitted_from', getFullOsmappLink(feature)],
    // ...(needsReview ? [['review_requested', 'yes']] : []),
  ];
  return `<osm>
      <changeset>
        ${tags.map(([k, v]) => `<tag k='${k}' v='${escape(v)}' />`).join('')}
      </changeset>
    </osm>`;
};

const getDescription = (toBeDeleted: boolean, feature: Feature) => {
  const undelete = feature.deleted;
  const action = undelete ? 'Undeleted' : toBeDeleted ? 'Deleted' : 'Edited';
  const name = getLabel(feature) || getUrlOsmId(feature.osmMeta);
  return `${action} ${name}`;
};

const getChangesetComment = (
  comment: string,
  toBeDeleted: boolean,
  feature: Feature,
) => {
  const description = getDescription(toBeDeleted, feature);
  return join(comment, ' • ', `${description} #osmapp`);
};

const getXmlTags = (newTags: FeatureTags) =>
  Object.entries(newTags)
    .filter(([k, v]) => k && v)
    .map(([k, v]) => ({ $: { k, v } }));

const getXmlMembers = (members: Members) =>
  members?.map(({ shortId, role }) => {
    const osmId = getApiId(shortId);
    return {
      $: { type: osmId.type, ref: `${osmId.id}`, role },
    };
  });

export const updateItemXml = (
  item: SingleDocXmljs,
  apiId: OsmId,
  changesetId: string,
  tags: FeatureTags,
  toBeDeleted: boolean,
  members?: Members,
  nodeLonLat?: LonLat,
) => {
  item[apiId.type][0].$.changeset = changesetId;
  if (!toBeDeleted) {
    item[apiId.type][0].tag = getXmlTags(tags);
    item[apiId.type][0].member = getXmlMembers(members);
    if (nodeLonLat) {
      item[apiId.type][0].$.lon = `${nodeLonLat[0]}`;
      item[apiId.type][0].$.lat = `${nodeLonLat[1]}`;
    }
  }
  return xmljsBuildOsm(item);
};

const checkVersionUnchanged = (
  freshItem: SingleDocXmljs,
  apiId: OsmId,
  ourVersion: number,
) => {
  const freshVersion = parseInt(freshItem[apiId.type][0].$.version, 10);
  if (ourVersion !== freshVersion) {
    throw new Error(
      `The ${getShortId(apiId)} has been updated, please reload.`,
    );
  }
};

const getNewNodeXml = async (
  changesetId: string,
  [lon, lat]: Position,
  newTags: FeatureTags,
) => {
  const xml = await parseToXmljs('<osm><node lon="x"/></osm>');
  xml.node[0].$.changeset = changesetId;
  xml.node[0].$.lon = `${lon}`;
  xml.node[0].$.lat = `${lat}`;
  xml.node[0].tag = getXmlTags(newTags);
  return xmljsBuildOsm(xml);
};

const getNewRelationXml = async (
  changesetId: string,
  newTags: FeatureTags,
  members: Members,
) => {
  const xml = await parseToXmljs('<osm><relation visible="true" /></osm>');
  xml.relation[0].$.changeset = changesetId;
  xml.relation[0].tag = getXmlTags(newTags);
  xml.relation[0].member = getXmlMembers(members);
  return xmljsBuildOsm(xml);
};

const saveChange = async (
  changesetId: string,
  { shortId, version, tags, toBeDeleted, nodeLonLat, members }: EditDataItem,
): Promise<OsmId> => {
  // TODO don't save changes if no change detected
  let apiId = getApiId(shortId);
  if (apiId.id < 0) {
    if (apiId.type === 'way') {
      throw new Error('We can only add new nodes and relations so far.');
    }
    if (apiId.type === 'node') {
      const content = await getNewNodeXml(changesetId, nodeLonLat, tags);
      const newNodeId = await api.createNodeItem(content);
      return { type: 'node', id: parseInt(newNodeId, 10) };
    }
    if (apiId.type === 'relation') {
      const content = await getNewRelationXml(changesetId, tags, members);
      const newRelationId = await api.createRelationItem(content);
      return { type: 'relation', id: parseInt(newRelationId, 10) };
    }
  }

  const freshItem = await api.getItem(apiId);
  checkVersionUnchanged(freshItem, apiId, version);

  // TODO document undelete feature - the flow is kinda unclear
  const newItem = updateItemXml(
    freshItem,
    apiId,
    changesetId,
    tags,
    toBeDeleted,
    members,
    nodeLonLat,
  );
  await api.putOrDeleteItem(toBeDeleted, apiId, newItem);
  return apiId;
};

const getCommentMulti = (
  original: Feature,
  comment: string,
  changes: EditDataItem[],
) => {
  const isClimbing = changes.some((change) => change.tags.climbing);
  const suffix = isClimbing ? ' #climbing' : '';

  // TODO find topmost parent in changes and use its name
  // eg. survey • Edited Roviště (5 items) #osmapp #climbing

  if (changes.length === 1 && original.point) {
    const typeTag = changes[0].tagsEntries[0]?.join('=') ?? 'node with no tags';
    return join(comment, ' • ', `Added ${typeTag} #osmapp`);
  }

  const toBeDeleted = changes.length === 1 && changes[0].toBeDeleted;
  const changesetComment = getChangesetComment(comment, toBeDeleted, original);
  return `${changesetComment}${suffix}`;
};

export const saveChanges = async (
  original: Feature,
  comment: string,
  changes: EditDataItem[],
): Promise<SuccessInfo> => {
  if (!changes.length) {
    throw new Error('No changes submitted.');
  }

  const changesetComment = getCommentMulti(original, comment, changes);
  const changesetXml = getChangesetXml({ changesetComment, feature: original });
  const changesetId = await api.putChangeset(changesetXml);

  // TODO refactor below
  // or even better use osmChange xml https://wiki.openstreetmap.org/wiki/API_v0.6#Diff_upload:_POST_/api/0.6/changeset/#id/upload
  const changesNodes = changes.filter(({ shortId }) => shortId[0] === 'n');
  const savedNodesIds = await Promise.all(
    changesNodes.map((change) => saveChange(changesetId, change)),
  );
  const nodeShortIds = changesNodes.map(({ shortId }) => shortId);
  const savedNodeIdsMap = zipObject(nodeShortIds, savedNodesIds);

  const changesWays = changes.filter(({ shortId }) => shortId[0] === 'w');
  const savedWaysIds = await Promise.all(
    changesWays.map((change) => saveChange(changesetId, change)),
  );

  const changesRelations = changes.filter(({ shortId }) => shortId[0] === 'r');

  const changesRelationsWithNewNodeIds = changesRelations.map((change) => {
    return {
      ...change,
      members: change.members?.map<Members[0]>((member) => {
        const shortId = member.shortId;
        const apiId = getApiId(shortId);
        if (apiId.type === 'node' && apiId.id < 0) {
          const newNodeId = savedNodeIdsMap[shortId];
          return { ...member, shortId: getShortId(newNodeId) };
        }

        return member;
      }),
    };
  });

  const savedRelationsIds = await Promise.all(
    changesRelationsWithNewNodeIds.map((change) =>
      saveChange(changesetId, change),
    ),
  );

  await api.putChangesetClose(changesetId);

  const ids = [...savedNodesIds, ...savedWaysIds, ...savedRelationsIds];
  const redirectId = original.point ? ids[0] : original.osmMeta;

  // TODO invalidate all changed also in server (?)
  clearFetchCache();

  return {
    type: 'edit',
    text: changesetComment,
    url: `${OSM_WEBSITE}/changeset/${changesetId}`,
    redirect: `/${getUrlOsmId(redirectId)}`,
  };
};
