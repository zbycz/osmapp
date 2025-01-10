import { OsmId } from '../types';
import { API_SERVER } from './consts';

export const getOsmUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}.json`;

export const getOsmFullUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/full.json`;

export const getOsmParentUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/relations.json`;

export const getOsmHistoryUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/history.json`;

export const getOsmUrlOrFull = ({ type, id }: OsmId) =>
  type === 'node' ? getOsmUrl({ type, id }) : getOsmFullUrl({ type, id });
