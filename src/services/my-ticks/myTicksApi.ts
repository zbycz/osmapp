import { ClimbingTick } from '../../types';
import { fetchJson } from '../fetch';

export const postClimbingTick = async (
  tick: Omit<ClimbingTick, 'id' | 'osmUserId'>,
) => {
  return await fetchJson<ClimbingTick>('/api/climbing-ticks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tick),
  });
};

export const getClimbingTicks = async () => {
  return await fetchJson<ClimbingTick[]>('/api/climbing-ticks', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

export const deleteClimbingTick = async (id: number) => {
  return await fetchJson(`/api/climbing-ticks/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
};
