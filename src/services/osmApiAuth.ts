import { buildXmlString, getUrlOsmId, OsmApiId, parseXmlString, prod } from './helpers';
import escape from 'lodash/escape';
import { Feature, FeatureTags } from './types';
import OsmAuth from 'osm-auth';
import getConfig from 'next/config';

const { publicRuntimeConfig: { osmappVersion } } = getConfig();

const osmUrl = prod
  ? 'https://www.openstreetmap.org'
  : 'https://master.apis.dev.openstreetmap.org';

const oauth = prod ? {
  oauth_consumer_key: 'OGIlDMpqYIRA35NBggNFNnRBftlWdJt4eE2z7eFb',
  oauth_secret: '37V3dRzWYfdnRrG8L8vaKyzs6A191HkRtXlaqNH9',

} : {
  // https://master.apis.dev.openstreetmap.org/changeset/1599
  // https://master.apis.dev.openstreetmap.org/node/967531
  oauth_consumer_key: 'eWdvGfVsTdhRCGtwRkn4qOBaBAIuVNX9gTX63TUm',
  oauth_secret: 'O0UXzrNbpFkbIVB0rqumhMSdqdC1wa9ZFMpPUBYG',
};

const auth = new OsmAuth({
  ...oauth,
  auto: true,
  landing: '/oauth-token.html',
  url: osmUrl,
});

const authFetch = async (options) =>
  new Promise<any>((resolve, reject) => {
    auth.xhr(
      options,
      (err, details) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(details);
      },
    );
  });

export const fetchOsmUsername = async () => {
  const details = await authFetch({
    method: 'GET',
    path: '/api/0.6/user/details.json',
  });
  const name = JSON.parse(details).user.display_name;
  window.localStorage.setItem('osm_username', name);
  return name;
};

export const getOsmUsername = () =>
  auth.authenticated() && window.localStorage.getItem('osm_username');


const putChangeset = (text: string) => authFetch({
  method: 'PUT',
  path: '/api/0.6/changeset/create',
  options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
  content: `<osm><changeset><tag k='created_by' v='OsmAPP ${osmappVersion}'/><tag k='comment' v='${escape(text)}'/></changeset></osm>`,
});

const getItem = (apiId: OsmApiId) => authFetch({
  method: 'GET',
  path: `/api/0.6/${getUrlOsmId(apiId)}`,
});

const putItem = (apiId: OsmApiId, content: string) => authFetch({
  method: 'PUT',
  path: `/api/0.6/${getUrlOsmId(apiId)}`,
  options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
  content,
});

export const editOsmFeature = async (
  feature: Feature,
  tags: FeatureTags,
  text: string,
) => {
  const apiId = prod ? feature.osmMeta : { type: 'node', id: '967531' };

  const changesetId = await putChangeset(text);
  const itemXml = await getItem(apiId);

  const osmXml = await parseXmlString(new XMLSerializer().serializeToString(itemXml));
  const element = osmXml[apiId.type];
  element.$.changeset = changesetId;
  element.tag = Object.entries(tags).map(([k,v]) => ({ '$': {k,v}}))

  await putItem(apiId, buildXmlString(osmXml));

  return { changesetUrl: `${osmUrl}/changeset/${changesetId}` };
};
