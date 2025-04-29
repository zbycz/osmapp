// TODO move this file to ./auth folder
import escape from 'lodash/escape';
import { Feature, FeatureTags, LonLat, OsmId, SuccessInfo } from '../types';
import { getApiId, getFullOsmappLink, getUrlOsmId } from '../helpers';
import { join } from '../../utils';
import { clearFetchCache } from '../fetchCache';
import { getLabel } from '../../helpers/featureLabel';
import {
  EditDataItem,
  Members,
} from '../../components/FeaturePanel/EditDialog/useEditItems';
import { OSM_WEBSITE } from './consts';
import { getDiffXml } from './auth/getDIffXml';
import { SingleDocXmljs } from './auth/xmlTypes';
import { xmljsBuildOsm } from './auth/xmlHelpers';
import * as api from './auth/api';
import { getFirstId } from './getFirstId';

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

  const diffXml = getDiffXml(changesetId, changes);
  const diffResult = await api.uploadDiff(changesetId, diffXml);
  const firstId = getFirstId(diffResult, changes);

  await api.putChangesetClose(changesetId);

  // TODO invalidate all changed also in server (?)
  clearFetchCache();

  return {
    type: 'edit',
    text: changesetComment,
    url: `${OSM_WEBSITE}/changeset/${changesetId}`,
    redirect: `/${getUrlOsmId(firstId)}`,
  };
};
