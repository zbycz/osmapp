import fetch from 'isomorphic-unfetch';
import type { LonLat } from './types';
import { FormData } from 'formdata-node';
import { fileFromPath } from "formdata-node/file-from-path";

const WIKI_URL = 'https://commons.wikimedia.org/w/api.php';

const getUploadOptions = (params: Record<string, string | Blob>) => {
  const formData = new FormData();
  Object.entries(params).forEach(([k, v]) => {
    formData.append(k, v);
  });
  return formData;
};

const getBody = (params: Record<string, string | Blob>) =>
  params.action === 'upload'
    ? getUploadOptions(params)
    : new URLSearchParams(params);

const createLocationClaim = (property, [longitude, latitude]: LonLat) => ({
  type: 'statement',
  mainsnak: {
    snaktype: 'value',
    property,
    datavalue: {
      type: 'globecoordinate',
      value: {
        latitude,
        longitude,
        globe: 'http://www.wikidata.org/entity/Q2',
        precision: 0.000001,
      },
    },
  },
});

export const claimsHelpers = {
  createDate: (time) => ({
    type: 'statement',
    mainsnak: {
      snaktype: 'value',
      property: 'P571', // https://www.wikidata.org/wiki/Property:P571 inception
      datavalue: { type: 'time', value: { time, timezone: 0 } },
    },
  }),
  createPhotoLocation: (lonLat: LonLat) => createLocationClaim('P1259', lonLat), // https://www.wikidata.org/wiki/Property:P1259 point of view
  createPlaceLocation: (lonLat: LonLat) => createLocationClaim('P9149', lonLat), // https://www.wikidata.org/wiki/Property:P9149 coordinates of depicted place
};

export const getMediaWikiSession = () => {
  let sessionCookie;

  const action = async (action, params) =>
    await fetch(
      // action === 'upload' ? 'http://httpbin.org/post' :
        WIKI_URL + (action === 'upload' ? '?action=upload' : ''), {
      method: 'POST',
      headers: {
        Cookie: sessionCookie,
      },
      body: getBody({ action, format: 'json', ...params }),
    });

  const getLoginToken = async () => {
    const response = await action('query', { meta: 'tokens', type: 'login' });
    const data = await response.json();
    sessionCookie = response.headers.get('set-cookie').split(';')[0];
    return data.query.tokens.logintoken;
  };

  const login = async (lgname, lgpassword) => {
    const lgtoken = await getLoginToken();
    const response = await action('login', { lgname, lgpassword, lgtoken });
    return await response.text();
  };

  const getCsrfToken = async () => {
    const response = await action('query', { meta: 'tokens' });
    const data = await response.json();
    const csrftoken = data.query.tokens.csrftoken;
    console.log('tok', { csrftoken });
    return csrftoken;
  };

  const upload = async (filepath, filename, text) => {
    const token = 'xx'; //await getCsrfToken();
    const response = await action('upload', {
      file: await fileFromPath(filepath),
      filename,
      text,
      comment: 'Initial upload from OsmAPP.org',
      token,
      formatversion: '2',
    });
    return await response.text();
  };

  // https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py#L132
  const editClaims = async (pageId, claims) => {
    const token = await getCsrfToken();
    const response = await action('wbeditentity', {
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

type PageInfo = {
  ns: number;
  title: string;
  missing?: boolean;
  pageid?: number;
  revisions?: Revision[];
};

type Revision = {
  revid: number;
  parentid: number;
  slots: Record<
    'main' | 'mediainfo',
    { contentmodel: string; contentformat: string; content: string }
  >;
};

export const getPageRevisions = async (titles: string[]) => {
  const response = await fetch(WIKI_URL, {
    method: 'POST',
    body: getBody({
      action: 'query',
      prop: 'revisions',
      titles: titles.join('|'),
      rvprop: 'ids|content',
      rvslots: '*',
      formatversion: '2',
      format: 'json',
    }),
  });
  const data = await response.json();
  return data.query.pages as PageInfo[];
};

export const isTitleAvailable = async (title: string) => {
  const response = await fetch(WIKI_URL, {
    method: 'POST',
    body: getBody({
      action: 'query',
      titles: title,
      format: 'json',
      formatversion: '2',
    }),
  });
  const data = await response.json();
  return data.query.pages[0].missing;
};
