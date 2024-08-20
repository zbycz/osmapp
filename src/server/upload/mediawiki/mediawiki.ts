import fetch from 'isomorphic-unfetch';
// import { FormData } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';
import { getBody, getUploadBody, parseCookies, WIKI_URL } from './utils';

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
        //"------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"action\"\r\n\r\nupload\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\njson\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"filename\"\r\n\r\nFile_1.jpg\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"file\"; filename=\"IMG_3379-EDIT Small.jpeg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"formatversion\"\r\n\r\n2\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"wrappedhtml\"\r\n\r\n0\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n6c671cec5e3046118e5d3494575b7a616644b2ce+\\\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa--\r\n"
        body: getUploadBody({ action, format: 'json', ...params }),
      });
    }

    return await fetch(WIKI_URL, {
      method: 'POST',
      headers: {
        Cookie: sessionCookie,
      },
      body: getBody({ action, format: 'json', ...params }),
    });
  };

  const getLoginToken = async () => {
    const response = await fetch(
      `${WIKI_URL}?action=query&format=json&meta=tokens&type=login`,
    );
    const data = await response.json();
    sessionCookie = parseCookies(response);
    console.log('data.query.tokens.logintoken', {
      sessionCookie,
      setcookies: response.headers.get('set-cookie'),
      logintok: data.query.tokens.logintoken,
    });
    return data.query.tokens.logintoken;
  };

  const login = async (lgname: string, lgpassword: string) => {
    const lgtoken = await getLoginToken();
    const response = await action('login', { lgname, lgpassword, lgtoken });
    return await response.text();
  };

  const getCsrfToken = async () => {
    const response = await fetch(
      `${WIKI_URL}?action=query&format=json&meta=tokens`,
      {
        headers: {
          Cookie: sessionCookie,
        },
      },
    );
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
    getCsrfToken,
  };
};
