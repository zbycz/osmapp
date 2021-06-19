import escape from 'lodash/escape';
import OsmAuth from 'osm-auth';
import getConfig from 'next/config';
import { Feature, FeatureTags, Position } from './types';
import {
  buildXmlString,
  getFullOsmappLink,
  getOsmappLink,
  getUrlOsmId,
  OsmApiId,
  parseXmlString,
  prod,
  stringifyDomXml,
} from './helpers';
import { join } from '../utils';
import { clearFeatureCache } from './osmApi';

const {
  publicRuntimeConfig: { osmappVersion },
} = getConfig();

const osmUrl = prod
  ? 'https://www.openstreetmap.org'
  : 'https://master.apis.dev.openstreetmap.org';

const oauth = prod
  ? {
      oauth_consumer_key: 'OGIlDMpqYIRA35NBggNFNnRBftlWdJt4eE2z7eFb',
      oauth_secret: '37V3dRzWYfdnRrG8L8vaKyzs6A191HkRtXlaqNH9',
    }
  : {
      // https://master.apis.dev.openstreetmap.org/changeset/1599
      // https://master.apis.dev.openstreetmap.org/node/967531
      oauth_consumer_key: 'eWdvGfVsTdhRCGtwRkn4qOBaBAIuVNX9gTX63TUm',
      oauth_secret: 'O0UXzrNbpFkbIVB0rqumhMSdqdC1wa9ZFMpPUBYG',
    };

const auth = new OsmAuth({
  ...oauth,
  auto: true,
  landing: '/oauth-token.html',
  url: osmUrl,
});

const authFetch = async (options) =>
  new Promise<any>((resolve, reject) => {
    auth.xhr(options, (err, details) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(details);
    });
  });

export const fetchOsmUsername = async () => {
  const details = await authFetch({
    method: 'GET',
    path: '/api/0.6/user/details.json',
  });
  const name = JSON.parse(details).user.display_name;
  window.localStorage.setItem('osm_username', name);
  return name;
};

export const osmLogout = async () => {
  auth.logout();
};

export const getOsmUsername = () =>
  auth.authenticated() && window.localStorage.getItem('osm_username');

const getChangesetXml = ({ changesetComment, feature }) => {
  const tags = [
    ['created_by', `OsmAPP ${osmappVersion}`],
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

const putChangeset = (content: string) =>
  authFetch({
    method: 'PUT',
    path: '/api/0.6/changeset/create',
    options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
    content,
  });

const putChangesetClose = (changesetId: string) =>
  authFetch({
    method: 'PUT',
    path: `/api/0.6/changeset/${changesetId}/close`,
  });

const getItem = (apiId: OsmApiId) =>
  authFetch({
    method: 'GET',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
  });

const putItem = (apiId: OsmApiId, content: string) =>
  authFetch({
    method: 'PUT',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
    options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
    content,
  });

const deleteItem = (apiId: OsmApiId, content: string) =>
  authFetch({
    method: 'DELETE',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
    options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
    content,
  });

const createItem = (content: string) =>
  authFetch({
    method: 'PUT',
    path: `/api/0.6/node/create`,
    options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
    content,
  });

const putOrDeleteItem = async (
  deleted: boolean,
  apiId: OsmApiId,
  newItem: string,
) => {
  if (deleted) {
    await deleteItem(apiId, newItem);
  } else {
    await putItem(apiId, newItem);
  }
};

const getDescription = (deleted, feature) => {
  const action = deleted ? 'Deleted' : 'Edited';
  const { subclass } = feature.properties;
  const name = feature.tags.name || subclass || getUrlOsmId(feature.osmMeta);
  return `${action} ${name}`;
};

const getChangesetComment = (
  comment: string,
  deleted: boolean,
  feature: Feature,
) => {
  const description = getDescription(deleted, feature);
  return join(comment, ' • ', `${description} #osmapp`);
};

const getXmlTags = (newTags: FeatureTags) =>
  Object.entries(newTags)
    .filter(([k, v]) => k && v)
    .map(([k, v]) => ({ $: { k, v } }));

const updateItemXml = async (
  item,
  apiId: OsmApiId,
  changesetId: string,
  newTags?: FeatureTags,
) => {
  const xml = await parseXmlString(stringifyDomXml(item));

  xml[apiId.type].$.changeset = changesetId;
  if (newTags) {
    xml[apiId.type].tag = getXmlTags(newTags);
  }
  return buildXmlString(xml);
};

export const editOsmFeature = async (
  feature: Feature,
  comment: string,
  newTags: FeatureTags,
  deleted: boolean,
) => {
  const apiId = prod ? feature.osmMeta : { type: 'node', id: '967531' };
  const changesetComment = getChangesetComment(comment, deleted, feature);
  const changesetXml = getChangesetXml({ changesetComment, feature });

  const changesetId = await putChangeset(changesetXml);
  const item = await getItem(apiId);

  const newItem = await updateItemXml(
    item,
    apiId,
    changesetId,
    !deleted ? newTags : undefined,
  );

  await putOrDeleteItem(deleted, apiId, newItem);
  await putChangesetClose(changesetId);

  clearFeatureCache(feature.osmMeta);

  return {
    type: 'edit',
    text: comment,
    url: `${osmUrl}/changeset/${changesetId}`,
    redirect: getOsmappLink(feature),
  };
};

const getNewItemXml = async (
  changesetId: string,
  [lon, lat]: Position,
  newTags: FeatureTags,
) => {
  const xml = await parseXmlString('<osm><node lat="x"/></osm>'); // TODO this is hackish
  xml.node.$.changeset = changesetId;
  xml.node.$.lon = lon;
  xml.node.$.lat = lat;
  xml.node.tag = getXmlTags(newTags);
  return buildXmlString(xml);
};

export const addOsmFeature = async (
  feature: Feature,
  comment: string,
  newTags: FeatureTags,
) => {
  const typeTag = Object.entries(newTags)[0]?.join('=');
  const changesetXml = getChangesetXml({
    feature,
    changesetComment: join(comment, ' • ', `Added ${typeTag} #osmapp`),
  });

  const changesetId = await putChangeset(changesetXml);
  const content = await getNewItemXml(changesetId, feature.center, newTags);
  const newNodeId = await createItem(content);
  await putChangesetClose(changesetId);

  return {
    type: 'edit',
    text: comment,
    url: `${osmUrl}/changeset/${changesetId}`,
    redirect: `/${getUrlOsmId({ type: 'node', id: newNodeId })}`, // this is internal osmappLink
  };
};
