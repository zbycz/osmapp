import Cookies from 'js-cookie';
import escape from 'lodash/escape';
import getConfig from 'next/config';
import { osmAuth } from 'osm-auth';
import { Feature, FeatureTags, Position } from './types';
import {
  buildXmlString,
  getFullOsmappLink,
  getOsmappLink,
  getUrlOsmId,
  OsmApiId,
  parseXmlString,
  stringifyDomXml,
} from './helpers';
import { join } from '../utils';
import { clearFeatureCache } from './osmApi';
import { isBrowser } from '../components/helpers';
import { getLabel } from '../helpers/featureLabel';

const {
  publicRuntimeConfig: { osmappVersion },
} = getConfig();

const prod = true;
const osmEditUrl = prod
  ? 'https://www.openstreetmap.org' // iD uses same URL https://ideditor.netlify.app/
  : 'https://master.apis.dev.openstreetmap.org';
const TEST_OSM_ID = { type: 'node', id: '967531' }; // https://master.apis.dev.openstreetmap.org/node/967531

// TS file in osm-auth is probably broken (new is required)
// @ts-ignore
const auth = osmAuth({
  client_id: 'vWUdEL3QMBCB2O9q8Vsrl3i2--tcM34rKrxSHR9Vg68',
  redirect_uri: isBrowser() && `${window.location.origin}/oauth-token.html`,
  scope: 'read_prefs write_api write_notes openid',
  auto: true,
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

export type OsmUser = {
  name: string;
  imageUrl: string;
};

export const fetchOsmUser = async (): Promise<OsmUser> => {
  const response = await authFetch({
    method: 'GET',
    path: '/api/0.6/user/details.json',
  });
  const details = JSON.parse(response).user;
  return {
    name: details.display_name,
    imageUrl:
      details.img?.href ??
      `https://www.gravatar.com/avatar/${details.id}?s=24&d=robohash`,
  };
};

export const loginAndfetchOsmUser = async (): Promise<OsmUser> => {
  const osmUser = await fetchOsmUser();

  const { url } = auth.options();
  const osmAccessToken = localStorage.getItem(`${url}oauth2_access_token`);
  const osmUserForSSR = JSON.stringify(osmUser);
  Cookies.set('osmAccessToken', osmAccessToken, { path: '/', expires: 365 });
  Cookies.set('osmUserForSSR', osmUserForSSR, { path: '/', expires: 365 });

  await fetch('/api/token-login');

  return osmUser;
};

export const osmLogout = async () => {
  auth.logout();
  Cookies.remove('osmAccessToken', { path: '/' });
  Cookies.remove('osmUserForSSR', { path: '/' });
};

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

const getItemHistory = (apiId: OsmApiId) =>
  authFetch({
    method: 'GET',
    path: `/api/0.6/${getUrlOsmId(apiId)}/history`,
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
  isDelete: boolean,
  apiId: OsmApiId,
  newItem: string,
) => {
  if (isDelete) {
    await deleteItem(apiId, newItem);
  } else {
    await putItem(apiId, newItem);
  }
};

const getItemOrLastHistoric = async (apiId: OsmApiId) => {
  try {
    return await getItem(apiId);
  } catch (e) {
    // e is probably XMLHttpRequest
    if (e?.status !== 410) {
      throw e;
    }

    // Mind that tags are fetched during feature fetch (osmApi#getOsmPromise()) and replaced after edit
    const itemHistory = await getItemHistory(apiId);
    const xml = await parseXmlString(stringifyDomXml(itemHistory));
    const items = xml[apiId.type];
    const existingVersion = items[items.length - 2];
    const deletedVersion = items[items.length - 1];
    existingVersion.$.version = deletedVersion.$.version;
    xml[apiId.type] = existingVersion;
    return buildXmlString(xml);
  }
};

const getDescription = (isCancelled, feature) => {
  const undelete = feature.deleted;
  const action = undelete ? 'Undeleted' : isCancelled ? 'Deleted' : 'Edited';
  const { subclass } = feature.properties;
  const name = feature.tags.name || subclass || getUrlOsmId(feature.osmMeta);
  return `${action} ${name}`;
};

const getChangesetComment = (
  comment: string,
  isCancelled: boolean,
  feature: Feature,
) => {
  const description = getDescription(isCancelled, feature);
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
  tags: FeatureTags,
  isDelete: boolean,
) => {
  const xml = await parseXmlString(stringifyDomXml(item));
  xml[apiId.type].$.changeset = changesetId;
  if (!isDelete) {
    xml[apiId.type].tag = getXmlTags(tags);
  }
  return buildXmlString(xml);
};

export const editOsmFeature = async (
  feature: Feature,
  comment: string,
  newTags: FeatureTags,
  isCancelled: boolean,
) => {
  const apiId = prod ? feature.osmMeta : TEST_OSM_ID;
  const changesetComment = getChangesetComment(comment, isCancelled, feature);
  const changesetXml = getChangesetXml({ changesetComment, feature });

  const changesetId = await putChangeset(changesetXml);
  const item = await getItemOrLastHistoric(apiId);

  // TODO use version from `feature` (we dont want to overwrite someones changes)
  // TODO or at least just apply tags diff (see createNoteText)
  const newItem = await updateItemXml(
    item,
    apiId,
    changesetId,
    newTags,
    isCancelled,
  );

  await putOrDeleteItem(isCancelled, apiId, newItem);
  await putChangesetClose(changesetId);

  clearFeatureCache(feature.osmMeta);

  return {
    type: 'edit',
    text: changesetComment,
    url: `${osmEditUrl}/changeset/${changesetId}`,
    redirect: `${getOsmappLink(feature)}`,
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
  const changesetComment = join(comment, ' • ', `Added ${typeTag} #osmapp`);
  const changesetXml = getChangesetXml({ feature, changesetComment });

  const changesetId = await putChangeset(changesetXml);
  const content = await getNewItemXml(changesetId, feature.center, newTags);
  const newNodeId = await createItem(content);
  await putChangesetClose(changesetId);

  const apiId = { type: 'node', id: newNodeId };
  return {
    type: 'edit',
    text: changesetComment,
    url: `${osmEditUrl}/changeset/${changesetId}`,
    redirect: `/${getUrlOsmId(apiId)}`,
  };
};

export type Change = {
  feature: Feature;
  allTags: FeatureTags;
  isDelete?: boolean;
};

const saveChange = async (
  changesetId: any,
  { feature, allTags, isDelete }: Change,
) => {
  const apiId = feature.osmMeta;
  const item = await getItem(apiId);

  // TODO use version from `feature` (we dont want to overwrite someones changes) or at least just apply tags diff (see createNoteText)
  const newItem = await updateItemXml(
    item,
    apiId,
    changesetId,
    allTags,
    isDelete,
  );

  await putOrDeleteItem(isDelete, apiId, newItem);
};

export const editCrag = async (
  crag: Feature,
  comment: string,
  changes: Change[],
) => {
  if (!changes.length) {
    return {
      type: 'error',
      text: 'No route has changed.',
    };
  }

  const changesetComment = join(
    comment,
    ' • ',
    `Edited ${getLabel(crag)} #osmapp #climbing`,
  );
  const changesetXml = getChangesetXml({ changesetComment, feature: crag });
  const changesetId = await putChangeset(changesetXml);

  await Promise.all(changes.map((change) => saveChange(changesetId, change)));
  await putChangesetClose(changesetId);

  return {
    type: 'edit',
    text: changesetComment,
    url: `${osmEditUrl}/changeset/${changesetId}`,
    redirect: `${getOsmappLink(crag)}`,
  };
};
