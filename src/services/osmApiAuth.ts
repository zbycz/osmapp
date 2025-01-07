import Cookies from 'js-cookie';
import escape from 'lodash/escape';
import { osmAuth, OSMAuthXHROptions } from 'osm-auth';
import { zipObject } from 'lodash';
import { Feature, FeatureTags, OsmId, Position, SuccessInfo } from './types';
import {
  buildXmlString,
  getApiId,
  getFullOsmappLink,
  getOsmappLink,
  getShortId,
  getUrlOsmId,
  parseToXml2Js,
  stringifyDomXml,
  Xml2JsMultiDoc,
  Xml2JsSingleDoc,
} from './helpers';
import { join } from '../utils';
import { clearFeatureCache } from './osmApi';
import { isBrowser } from '../components/helpers';
import { getLabel } from '../helpers/featureLabel';
import {
  EditDataItem,
  Members,
} from '../components/FeaturePanel/EditDialog/useEditItems';
import {
  OSM_WEBSITE,
  PROD_CLIENT_ID,
  OSM_USER_COOKIE,
  TEST_CLIENT_ID,
  TEST_SERVER,
  USE_PROD_API,
  OSM_TOKEN_COOKIE,
} from './osmApiConsts';

// TS file in osm-auth is probably broken (new is required)
// @ts-ignore
const auth = osmAuth({
  redirect_uri: isBrowser() && `${window.location.origin}/oauth-token.html`,
  scope: 'read_prefs write_api write_notes openid',
  auto: true,
  client_id: USE_PROD_API ? PROD_CLIENT_ID : TEST_CLIENT_ID,
  url: USE_PROD_API ? undefined : TEST_SERVER,
  apiUrl: USE_PROD_API ? undefined : TEST_SERVER,
});

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
  const accessToken = localStorage.getItem(`${url}oauth2_access_token`);
  const osmUserForSSR = JSON.stringify(osmUser);
  Cookies.set(OSM_TOKEN_COOKIE, accessToken, { path: '/', expires: 365 });
  Cookies.set(OSM_USER_COOKIE, osmUserForSSR, { path: '/', expires: 365 });

  return osmUser;
};

export const osmLogout = async () => {
  auth.logout();
  Cookies.remove(OSM_TOKEN_COOKIE, { path: '/' });
  Cookies.remove(OSM_USER_COOKIE, { path: '/' });
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

const updateItemXml = async (
  item: Xml2JsSingleDoc,
  apiId: OsmId,
  changesetId: string,
  tags: FeatureTags,
  toBeDeleted: boolean,
  members?: Members,
) => {
  item[apiId.type].$.changeset = changesetId;
  if (!toBeDeleted) {
    item[apiId.type].tag = getXmlTags(tags);
    item[apiId.type].member = getXmlMembers(members);
  }
  return buildXmlString(item);
};

const checkVersionUnchanged = (
  freshItem: Xml2JsSingleDoc,
  apiId: OsmId,
  ourVersion: number,
) => {
  const freshVersion = parseInt(freshItem[apiId.type].$.version, 10);
  if (ourVersion !== freshVersion) {
    throw new Error(
      `The ${getShortId(apiId)} has been updated, please reload.`,
    );
  }
};

// TODO maybe split to editOsmFeature and undeleteOsmFeature? the flow is kinda unclear
export const editOsmFeature = async (
  feature: Feature,
  comment: string,
  newTags: FeatureTags,
  toBeDeleted: boolean,
): Promise<SuccessInfo> => {
  const apiId = feature.osmMeta;
  const freshItem = await getItemOrLastHistoric(apiId);
  checkVersionUnchanged(freshItem, apiId, feature.osmMeta.version);

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
    url: `${OSM_WEBSITE}/changeset/${changesetId}`,
    redirect: `${getOsmappLink(feature)}`,
  };
};

const getNewNodeXml = async (
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

const saveChange = async (
  changesetId: string,
  { shortId, version, tags, toBeDeleted, newNodeLonLat, members }: EditDataItem,
): Promise<OsmId> => {
  let apiId = getApiId(shortId);
  if (apiId.id < 0) {
    if (apiId.type !== 'node') {
      throw new Error('We can only add new nodes so far.');
    }
    const content = await getNewNodeXml(changesetId, newNodeLonLat, tags);
    const newNodeId = await createItem(content);
    return { type: 'node', id: parseInt(newNodeId, 10) };
  }

  const freshItem = await getItem(apiId);
  checkVersionUnchanged(freshItem, apiId, version);

  const newItem = await updateItemXml(
    freshItem,
    apiId,
    changesetId,
    tags,
    toBeDeleted,
    members,
  );
  await putOrDeleteItem(toBeDeleted, apiId, newItem);
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

  if (changes.length === 1 && changes[0].newNodeLonLat) {
    const typeTag = Object.entries(changes[0].tags)[0]?.join('=');
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
  const changesetId = await putChangeset(changesetXml);

  // TODO refactor below
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

  await putChangesetClose(changesetId);

  const ids = [...savedNodesIds, ...savedWaysIds, ...savedRelationsIds];
  const redirectId = original.point ? ids[0] : original.osmMeta;

  return {
    type: 'edit',
    text: changesetComment,
    url: `${OSM_WEBSITE}/changeset/${changesetId}`,
    redirect: `/${getUrlOsmId(redirectId)}`,
  };
};

// ---- edit crag:
// TODO refactor to use saveChanges()

export type CragChange = {
  feature: Feature;
  allTags: FeatureTags;
  toBeDeleted?: boolean;
};

const saveCragChange = async (
  changesetId: any,
  { feature, allTags, toBeDeleted }: CragChange,
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
  changes: CragChange[],
) => {
  if (!changes.length) {
    return {
      type: 'error',
      text: 'No route has changed.',
    }; // TODO this is not SuccessInfo type
  }

  const changesetComment = join(
    comment,
    ' • ',
    `Edited ${getLabel(crag)} #osmapp #climbing`,
  );
  const changesetXml = getChangesetXml({ changesetComment, feature: crag });
  const changesetId = await putChangeset(changesetXml);

  await Promise.all(
    changes.map((change) => saveCragChange(changesetId, change)),
  );
  await putChangesetClose(changesetId);

  return {
    type: 'edit',
    text: changesetComment,
    url: `${OSM_WEBSITE}/changeset/${changesetId}`,
    redirect: `${getOsmappLink(crag)}`,
  };
};
