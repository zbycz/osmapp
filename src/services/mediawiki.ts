import fetch from 'isomorphic-unfetch';
import type { LonLat } from './types';
import form from 'form-data';

const WIKI_URL = 'https://commons.wikimedia.org/w/api.php';

const getUploadOptions = (params: Record<string, string | Blob>) => {
  const formData = new form();
  Object.entries(params).forEach(([k, v]) => {
    formData.append(k, v);
  });
  return formData;
};

const getBody = (params: Record<string, string | Blob>) =>
  params.action === 'upload'
    ? getUploadOptions(params)
    : new URLSearchParams(params);


export type UploadParams = {
  file: any;
  filename: string;
  text: string;
  comment: string;
  ignorewarnings: boolean; // overwrite existing file
};

export const getMediaWikiSession = () => {
  let sessionCookie;

  const action = async (action, params) =>
    await fetch(WIKI_URL, {
      method: "POST",
      headers: { Cookie: sessionCookie },
      body: getBody({ action, format: "json", bot: true, ...params })
    });

  const getLoginToken = async () => {
    const response = await action('query', { meta: 'tokens', type: 'login' });
    sessionCookie = response.headers.get('set-cookie').split(';')[0];
    const data = await response.json();
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
    return data.query.tokens.csrftoken;
  };

  const upload = async (params: UploadParams) => {
    const token = await getCsrfToken();
    console.log({ token });
    const response = await action('upload', { ...params, token });
    return await response.text();
  };

  //  api.php?action=wbeditentity&id=Q4115189&data={"labels":[{"language":"no","value":"Bar","add":""}]}
  // api.php?action=wbeditentity&id=Q4115189&data={"claims":[
  //    {"mainsnak":{"snaktype":"value","property":"P56","datavalue":{"value":"ExampleString","type":"string"}},"type":"statement","rank":"normal"}
  //    ]}

  const createClaim = async (pageId, claim) => {
    const token = await getCsrfToken();
    const response = await action('wbsetclaim', {
      baserevid: pageId,
      claim: JSON.stringify(claim),
      token,
    });
    return await response.json();
  };

  const addDate = async (pageId, time) =>
    await createClaim(pageId, {
      type: 'statement',
      mainsnak: {
        snaktype: 'value',
        property: 'P571', // https://www.wikidata.org/wiki/Property:P571 inception
        datavalue: {
          type: 'time',
          value: {
            time,
            timezone: 0,
          },
        },
      },
    });

  const createLocationClaim = async (
    pageId,
    property,
    [longitude, latitude]: LonLat,
  ) =>
    await createClaim(pageId, {
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
      // id: 'M147484063$377cd422-40b1-14d4-0f81-4b76dbaa9f09',
      // rank: 'normal',
    });

  const addPhotoLocation = async (pageId, lonLat: LonLat) =>
    await createLocationClaim(pageId, 'P1259', lonLat); // https://www.wikidata.org/wiki/Property:P1259 point of view

  const addPlaceLocation = async (pageId, lonLat: LonLat) =>
    await createLocationClaim(pageId, 'P9149', lonLat); // https://www.wikidata.org/wiki/Property:P9149 coordinates of depicted place

  return {
    login,
    upload,
    addDate,
    addPhotoLocation,
    addPlaceLocation,
  };
};
