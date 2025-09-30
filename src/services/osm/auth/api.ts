import { authFetch } from './authFetch';
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

export const uploadDiff = async (changesetId: string, content: string) => {
  const result = await authFetch<Node>({
    method: 'POST',
    path: `/api/0.6/changeset/${changesetId}/upload`,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    content,
  });
  return await parseToXmljs<DiffResultXmljs>(stringifyDomXml(result));
};
