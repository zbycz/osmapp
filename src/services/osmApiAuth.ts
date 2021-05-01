import escape from 'lodash/escape';
import OsmAuth from 'osm-auth';
import getConfig from 'next/config';
import { Feature, FeatureTags } from './types';
import {
  buildXmlString,
  getUrlOsmId,
  OsmApiId,
  parseXmlString,
  prod,
} from './helpers';

const {
  publicRuntimeConfig: { osmappVersion },
} = getConfig();

const osmUrl = prod
  ? 'https://www.openstreetmap.org'
  : 'https://master.apis.dev.openstreetmap.org';

const oauth = prod
  ? {
      oauth_consumer_key: 'OGIlDMpqYIRA35NBggNFNnRBftlWdJt4eE2z7eFb',
      oauth_secret: '37V3dRzWYfdnRrG8L8vaKyzs6A191HkRtXlaqNH9',
    }
  : {
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
    auth.xhr(options, (err, details) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(details);
    });
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

export const osmLogout = async () => {
  auth.logout();
};

export const getOsmUsername = () =>
  auth.authenticated() && window.localStorage.getItem('osm_username');

const getChangesetXml = ({ comment, needsReview }) => {
  const tags = [
    ['created_by', `OsmAPP ${osmappVersion}`],
    ['comment', comment],
    ...(needsReview ? [['review_requested', 'yes']] : []),
  ];
  return `<osm>
      <changeset>
        ${tags.map(([k, v]) => `<tag k='${k}' v='${escape(v)}' />`).join('')}
      </changeset>
    </osm>`;
};

const putChangeset = (content: string) =>
  authFetch({
    method: 'PUT',
    path: '/api/0.6/changeset/create',
    options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
    content,
  });

const getItem = (apiId: OsmApiId) =>
  authFetch({
    method: 'GET',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
  });

const putItem = (apiId: OsmApiId, content: string) =>
  authFetch({
    method: 'PUT',
    path: `/api/0.6/${getUrlOsmId(apiId)}`,
    options: { header: { 'Content-Type': 'text/xml; charset=utf-8' } },
    content,
  });

export const editOsmFeature = async (
  feature: Feature,
  note: string,
  newTags: FeatureTags,
) => {
  const apiId = prod ? feature.osmMeta : { type: 'node', id: '967531' };
  const comment = `${note} • Submitted from https://osmapp.org/${getUrlOsmId(
    feature.osmMeta,
  )}`;

  const changesetXml = getChangesetXml({ comment, needsReview: false });
  const changesetId = await putChangeset(changesetXml);

  const itemXml = await getItem(apiId);
  const osmXml = await parseXmlString(
    new XMLSerializer().serializeToString(itemXml), // TODO get text from osmAuth.xhr ?
  );
  const element = osmXml[apiId.type];
  element.$.changeset = changesetId;
  element.tag = Object.entries(newTags)
    .filter(([k, v]) => k && v)
    .map(([k, v]) => ({ $: { k, v } }));
  const itemNewXml = buildXmlString(osmXml);
  await putItem(apiId, itemNewXml);

  return {
    type: 'edit',
    text: comment,
    url: `${osmUrl}/changeset/${changesetId}`,
  };
};
