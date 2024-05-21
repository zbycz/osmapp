import fetch from "isomorphic-unfetch";
import type { LonLat } from "./types";
// import { FormData } from 'formdata-node';
import { fileFromPath } from "formdata-node/file-from-path";

const WIKI_URL = 'https://test.wikidata.org/w/api.php';

const getUploadBody = (params: Record<string, string | Blob>) => {
  const formData = new FormData();
  Object.entries(params).forEach(([k, v]) => {
    formData.append(k, v);
  });
  return formData;
};

const getBody = (params: Record<string, string | Blob>) =>
  params.action === 'upload'
    ? getUploadBody(params)
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

function parseCookies(response: Response) {
  const headers = new Headers(response.headers);
  const setCookies = headers.getSetCookie();

  return setCookies.map((cookie) => {
    const [name, value] = cookie.split(';')[0].split('=');
    return `${name}=${value}`;
  }).join(';');
}

export const getMediaWikiSession = () => {
  let sessionCookie;

  const action = async (action, params) => {
    if (action === 'upload') {
      return await fetch(WIKI_URL, {
        method: 'POST',
        headers: {
          Cookie: sessionCookie,
          // "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryn4nr36VFDeyzCBVa",
        },
        body: //"------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"action\"\r\n\r\nupload\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\njson\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"filename\"\r\n\r\nFile_1.jpg\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"file\"; filename=\"IMG_3379-EDIT Small.jpeg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"formatversion\"\r\n\r\n2\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"wrappedhtml\"\r\n\r\n0\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n6c671cec5e3046118e5d3494575b7a616644b2ce+\\\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa--\r\n"
         getUploadBody({ action, format: "json", ...params })
      });
    }


    return await fetch(
      // action === 'upload' ? 'http://httpbin.org/post' :
      WIKI_URL, {
        method: "POST",
        headers: {
          Cookie: sessionCookie
        },
        body: getBody({ action, format: "json", ...params })
      });
  };

  const getLoginToken = async () => {
    const response = await fetch(`${WIKI_URL}?action=query&format=json&meta=tokens&type=login`, {
      headers: {
        Cookie: sessionCookie
      }
    });
    const data = await response.json();
    sessionCookie = parseCookies(response)
    console.log("data.query.tokens.logintoken", {sessionCookie, setcookies: response.headers.get('set-cookie'), logintok: data.query.tokens.logintoken})
    return data.query.tokens.logintoken;
  };

  const login = async (lgname, lgpassword) => {
    const lgtoken = await getLoginToken();
    const response = await action('login', { lgname, lgpassword, lgtoken });
    return await response.text();
  };

  const getCsrfToken = async () => {
    const response = await fetch(`${WIKI_URL}?action=query&format=json&meta=tokens`, {
        headers: {
          Cookie: sessionCookie
        }
      });
    const data = await response.json();
    const csrftoken = data.query.tokens.csrftoken;
    console.log('tok', { sessionCookie, tokens: data.query.tokens, csrftoken });
    return csrftoken;
  };

  const upload = async (filepath, filename, text) => {
    const token = await getCsrfToken();
    const params = {
      file: await fileFromPath(filepath),
      filename,
      text,
      comment: 'Initial upload from OsmAPP.org',
      token,
      formatversion: '2',
    };
    const response = await action('upload', params);
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
