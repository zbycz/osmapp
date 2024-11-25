import Cookies from 'js-cookie';
import escape from 'lodash/escape';
import { osmAuth, OSMAuthXHROptions } from 'osm-auth';
import { Feature, FeatureTags, OsmId, Position, SuccessInfo } from './types';
import {
  buildXmlString,
  getFullOsmappLink,
  getOsmappLink,
  getUrlOsmId,
  parseToXml2Js,
  prod,
  stringifyDomXml,
  Xml2JsMultiDoc,
  Xml2JsSingleDoc,
} from './helpers';
import { join } from '../utils';
import { clearFeatureCache } from './osmApi';
import { isBrowser } from '../components/helpers';
import { getLabel } from '../helpers/featureLabel';

const PROD_CLIENT_ID = 'vWUdEL3QMBCB2O9q8Vsrl3i2--tcM34rKrxSHR9Vg68';

// testable on http://127.0.0.1:3000
const TEST_CLIENT_ID = 'a_f_aB7ADY_kdwe4YHpmCSBtNtDZ-BitW8m5I6ijDwI';
const TEST_SERVER = 'https://master.apis.dev.openstreetmap.org';
const TEST_OSM_ID: OsmId = { type: 'node', id: 967531 }; // every edit goes here, https://master.apis.dev.openstreetmap.org/node/967531

// TS file in osm-auth is probably broken (new is required)
// @ts-ignore
const auth = osmAuth({
  redirect_uri: isBrowser() && `${window.location.origin}/oauth-token.html`,
  scope: 'read_prefs write_api write_notes openid',
  auto: true,
  client_id: prod ? PROD_CLIENT_ID : TEST_CLIENT_ID,
  url: prod ? undefined : TEST_SERVER,
  apiUrl: prod ? undefined : TEST_SERVER,
});
const osmWebsite = prod ? 'https://www.openstreetmap.org' : TEST_SERVER;

const authFetch = async <T>(options: OSMAuthXHROptions): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    auth.xhr(options, (err: any, details: T) => {
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
  const response = await authFetch<string>({
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

const putChangeset = (content: string) =>
  authFetch<string>({
    method: 'PUT',
    path: '/api/0.6/changeset/create',
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });

const putChangesetClose = (changesetId: string) =>
  authFetch<void>({
    method: 'PUT',
    path: `/api/0.6/changeset/${changesetId}/close`,
  });

const getItem = async (apiId: OsmId) => {
  const item = await authFetch<Node>({
    method: 'GET',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
  });
  return await parseToXml2Js(stringifyDomXml(item));
};

const getItemHistory = (apiId: OsmId) =>
  authFetch<Node>({
    method: 'GET',
    path: `/api/0.6/${getUrlOsmId(apiId)}/history`,
  });

const putItem = (apiId: OsmId, content: string) =>
  authFetch<void>({
    method: 'PUT',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });

const deleteItem = (apiId: OsmId, content: string) =>
  authFetch<void>({
    method: 'DELETE',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });

const createItem = (content: string) =>
  authFetch<string>({
    method: 'PUT',
    path: `/api/0.6/node/create`,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });

const putOrDeleteItem = async (
  toBeDeleted: boolean,
  apiId: OsmId,
  newItem: string,
) => {
  if (toBeDeleted) {
    await deleteItem(apiId, newItem);
  } else {
    await putItem(apiId, newItem);
  }
};

const getItemOrLastHistoric = async (
  apiId: OsmId,
): Promise<Xml2JsSingleDoc> => {
  try {
    return await getItem(apiId);
  } catch (e) {
    // e is probably XMLHttpRequest
    if (e?.status !== 410) {
      throw e;
    }

    // For undelete we return the latest "existing" version
    const itemHistory = await getItemHistory(apiId);
    const xml = await parseToXml2Js<Xml2JsMultiDoc>(
      stringifyDomXml(itemHistory),
    );
    const items = xml[apiId.type];
    const existingVersion = items[items.length - 2];
    const deletedVersion = items[items.length - 1];
    existingVersion.$.version = deletedVersion.$.version;
    return {
      [apiId.type]: existingVersion,
    } as Xml2JsSingleDoc;
  }
};

const getDescription = (toBeDeleted: boolean, feature: Feature) => {
  const undelete = feature.deleted;
  const action = undelete ? 'Undeleted' : toBeDeleted ? 'Deleted' : 'Edited';
  const { subclass } = feature.properties;
  const name = feature.tags.name || subclass || getUrlOsmId(feature.osmMeta);
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

const updateItemXml = async (
  item: Xml2JsSingleDoc,
  apiId: OsmId,
  changesetId: string,
  tags: FeatureTags,
  toBeDeleted: boolean,
) => {
  item[apiId.type].$.changeset = changesetId;
  if (!toBeDeleted) {
    item[apiId.type].tag = getXmlTags(tags);
  }
  return buildXmlString(item);
};

const checkVersionUnchanged = (
  freshItem: Xml2JsSingleDoc,
  apiId: OsmId,
  feature: Feature,
) => {
  if (apiId === TEST_OSM_ID) {
    return;
  }

  const freshVersion = parseInt(freshItem[apiId.type].$.version, 10);
  if (feature.osmMeta.version !== freshVersion) {
    throw new Error('The object has been updated, reload and try again');
  }
};

// TODO maybe split to editOsmFeature and undeleteOsmFeature? the flow is kinda unclear
export const editOsmFeature = async (
  feature: Feature,
  comment: string,
  newTags: FeatureTags,
  toBeDeleted: boolean,
): Promise<SuccessInfo> => {
  const apiId = prod ? feature.osmMeta : TEST_OSM_ID;
  const freshItem = await getItemOrLastHistoric(apiId);
  checkVersionUnchanged(freshItem, apiId, feature);

  const changesetComment = getChangesetComment(comment, toBeDeleted, feature);
  const changesetXml = getChangesetXml({ changesetComment, feature });
  const changesetId = await putChangeset(changesetXml);

  const newItem = await updateItemXml(
    freshItem,
    apiId,
    changesetId,
    newTags,
    toBeDeleted,
  );

  await putOrDeleteItem(toBeDeleted, apiId, newItem);
  await putChangesetClose(changesetId);

  clearFeatureCache(feature.osmMeta);

  return {
    type: 'edit',
    text: changesetComment,
    url: `${osmWebsite}/changeset/${changesetId}`,
    redirect: `${getOsmappLink(feature)}`,
  };
};

const getNewItemXml = async (
  changesetId: string,
  [lon, lat]: Position,
  newTags: FeatureTags,
) => {
  const xml = await parseToXml2Js('<osm><node lon="x"/></osm>');
  xml.node.$.changeset = changesetId;
  xml.node.$.lon = `${lon}`;
  xml.node.$.lat = `${lat}`;
  xml.node.tag = getXmlTags(newTags);
  return buildXmlString(xml);
};

export const addOsmFeature = async (
  feature: Feature,
  comment: string,
  newTags: FeatureTags,
): Promise<SuccessInfo> => {
  const typeTag = Object.entries(newTags)[0]?.join('=');
  const changesetComment = join(comment, ' • ', `Added ${typeTag} #osmapp`);
  const changesetXml = getChangesetXml({ feature, changesetComment });

  const changesetId = await putChangeset(changesetXml);
  const content = await getNewItemXml(changesetId, feature.center, newTags);
  const newNodeId = await createItem(content);
  await putChangesetClose(changesetId);

  const apiId: OsmId = { type: 'node', id: parseInt(newNodeId, 10) };
  return {
    type: 'edit',
    text: changesetComment,
    url: `${osmWebsite}/changeset/${changesetId}`,
    redirect: `/${getUrlOsmId(apiId)}`,
  };
};

export type Change = {
  feature: Feature;
  allTags: FeatureTags;
  toBeDeleted?: boolean;
};

const saveChange = async (
  changesetId: any,
  { feature, allTags, toBeDeleted }: Change,
) => {
  const apiId = feature.osmMeta;
  const item = await getItem(apiId);

  // TODO use version from `feature` (we dont want to overwrite someones changes) or at least just apply tags diff (see createNoteText)
  const newItem = await updateItemXml(
    item,
    apiId,
    changesetId,
    allTags,
    toBeDeleted,
  );

  await putOrDeleteItem(toBeDeleted, apiId, newItem);
};

export const editCrag = async (
  crag: Feature,
  comment: string,
  changes: Change[],
) => {
  // if (!changes.length) {
  //   return {
  //     type: 'error',
  //     text: 'No route has changed.',
  //   }; // TODO this is not SuccessInfo type
  // }

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
    url: `${osmWebsite}/changeset/${changesetId}`,
    redirect: `${getOsmappLink(crag)}`,
  };
};
