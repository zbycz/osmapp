import { ClimbingTick, ClimbingTickDb } from '../../types';
import { fetchJson } from '../fetch';
import { getApiId, getShortId } from '../helpers';
import { OsmType } from '../types';

const convertToDb = (tick: Partial<ClimbingTick>): Partial<ClimbingTickDb> => {
  const { shortId, ...rest } = tick;
  const osmId = shortId ? getApiId(shortId) : false;
  const osmDbId = osmId ? { osmType: osmId.type, osmId: osmId.id } : {};

  return {
    ...rest,
    ...osmDbId,
  };
};

const convertFromDb = (dbRow: ClimbingTickDb): ClimbingTick => {
  const { osmType, osmId, ...rest } = dbRow;
  const shortId =
    osmType && osmId
      ? getShortId({ type: osmType as OsmType, id: osmId })
      : null;

  return {
    ...rest,
    shortId,
  };
};

export const postClimbingTick = async (
  tick: Partial<Omit<ClimbingTick, 'id' | 'osmUserId'>>,
) => {
  return await fetchJson('/api/climbing-ticks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(convertToDb(tick)),
  });
};

export const putClimbingTick = async (
  tick: Partial<Omit<ClimbingTick, 'id' | 'osmUserId'>>,
) => {
  return await fetchJson<ClimbingTick>('/api/climbing-ticks', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(convertToDb(tick)),
  });
};

export const getClimbingTicks = async () => {
  const allTicks = await fetchJson<ClimbingTickDb[]>('/api/climbing-ticks', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    nocache: true,
  });

  return allTicks.map(convertFromDb);
};

export const deleteClimbingTick = async (id: number) => {
  return await fetchJson(`/api/climbing-ticks/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
};
