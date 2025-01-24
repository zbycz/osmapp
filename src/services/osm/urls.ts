import { OsmId } from '../types';
import { API_SERVER } from './consts';

export type NodeOsmId = { type: 'node'; id: number };
export const isNodeOsmId = (apiId: OsmId): apiId is NodeOsmId =>
  apiId.type === 'node';

export const getOsmUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}.json`;

export const getOsmFullUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/full.json`;

export const getOsmParentUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/relations.json`;

export const getOsmNodesWaysUrl = ({ id }: NodeOsmId) =>
  `${API_SERVER}/api/0.6/node/${id}/ways.json`;

export const getOsmHistoryUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/history.json`;

export const getOsmUrlOrFull = ({ type, id }: OsmId) =>
  type === 'node' ? getOsmUrl({ type, id }) : getOsmFullUrl({ type, id });
