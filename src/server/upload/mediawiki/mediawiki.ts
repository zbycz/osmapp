import fetch from 'isomorphic-unfetch';
// import { fileFromPath } from 'formdata-node/file-from-path';
import {
  FORMAT,
  getUploadBody,
  parseCookies,
  UploadParams,
  WIKI_URL,
} from './utils';
import { readFile } from 'node:fs/promises';

type Params = Record<string, string>;

export const getMediaWikiSession = () => {
  let sessionCookie: string | undefined;

  const GET = async (action: string, params: Params) => {
    const query = new URLSearchParams({ action, ...params, ...FORMAT });
    const response = await fetch(`${WIKI_URL}?${query}`, {
      headers: { Cookie: sessionCookie },
    });
    sessionCookie = parseCookies(response);
    return response.json();
  };

  const POST = async (action: string, params: Params) => {
    const query = new URLSearchParams({ action, ...params, ...FORMAT });
    const response = await fetch(WIKI_URL, {
      method: 'POST',
      headers: { Cookie: sessionCookie },
      body: query,
    });
    sessionCookie = parseCookies(response);
    return response.json();
  };

  const UPLOAD = async (action: string, params: UploadParams) => {
    const response = await fetch('http://httpbin.org/post', {
      method: 'POST',
      headers: { Cookie: sessionCookie },
      body: getUploadBody({ action, ...params, ...FORMAT }),
    });
    sessionCookie = parseCookies(response);
    return response.json();
  };

  const getLoginToken = async (): Promise<string> => {
    const data = await GET('query', { meta: 'tokens', type: 'login' });
    return data.query.tokens.logintoken;
  };

  const login = async (lgname: string, lgpassword: string) => {
    const lgtoken = await getLoginToken();
    const data = await POST('login', { lgname, lgpassword, lgtoken });
    return data.login;
  };

  const getCsrfToken = async () => {
    const data = await GET('query', { meta: 'tokens', type: 'csrf' });
    return data.query.tokens.csrftoken;
  };

  const upload = async (filepath: string, filename: string, text: string) => {
    const token = await getCsrfToken();
    const file = await readFile(filepath);
    const blob = new Blob([file], { type: 'application/octet-stream' });

    const data = await UPLOAD('upload', {
      file: blob,
      filename,
      text,
      comment: 'Initial upload from OsmAPP.org',
      token,
    });
    return data;
  };

  // https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py#L132
  const editClaims = async (pageId: string, claims) => {
    const token = await getCsrfToken();
    const response = await POST('wbeditentity', {
      id: pageId,
      data: JSON.stringify({ claims }),
      token,
    });
    return await response.json();
  };

  return {
    login,
    upload,
    editClaims,
  };
};
