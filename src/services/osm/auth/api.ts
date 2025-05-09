import { OsmId } from '../../types';
import { authFetch } from './authFetch';
import { getUrlOsmId } from '../../helpers';
import { parseToXmljs } from './xmlHelpers';
import { DiffResultXmljs } from './xmlTypes';
import { stringifyDomXml } from './stringifyDomXml';

export const putChangeset = (content: string) =>
  authFetch<string>({
    method: 'PUT',
    path: '/api/0.6/changeset/create',
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });

export const putChangesetClose = (changesetId: string) =>
  authFetch<void>({
    method: 'PUT',
    path: `/api/0.6/changeset/${changesetId}/close`,
  });

export const getItem = async (apiId: OsmId) => {
  const item = await authFetch<Node>({
    method: 'GET',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
  });
  return await parseToXmljs(stringifyDomXml(item));
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

export const createNodeItem = (content: string) =>
  authFetch<string>({
    method: 'PUT',
    path: `/api/0.6/node/create`,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });

export const createRelationItem = (content: string) =>
  authFetch<string>({
    method: 'PUT',
    path: `/api/0.6/relation/create`,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });

export const uploadDiff = async (changesetId: string, content: string) => {
  const result = await authFetch<Node>({
    method: 'POST',
    path: `/api/0.6/changeset/${changesetId}/upload`,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });
  return await parseToXmljs<DiffResultXmljs>(stringifyDomXml(result));
};

export const putOrDeleteItem = async (
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

// const getItemOrLastHistoric = async (apiId: OsmId): Promise<SingleDocXmljs> => {
//   try {
//     return await getItem(apiId);
//   } catch (e) {
//     // e is probably XMLHttpRequest
//     if (e?.status !== 410) {
//       throw e;
//     }
//
//     // For undelete we return the latest "existing" version
//     const itemHistory = await getItemHistory(apiId);
//     const xml = await parseToXmljs<MultiDocXmljs>(stringifyDomXml(itemHistory));
//     const items = xml[apiId.type];
//     const existingVersion = items[items.length - 2];
//     const deletedVersion = items[items.length - 1];
//     existingVersion.$.version = deletedVersion.$.version;
//     return {
//       [apiId.type]: existingVersion,
//     } as SingleDocXmljs;
//   }
// };
