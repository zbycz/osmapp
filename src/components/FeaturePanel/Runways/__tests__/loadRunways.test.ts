import * as fetchModule from '../../../../services/fetch';
import { loadRunways } from '../loadRunways';

jest.mock('../../../../services/fetch');

test('parses overpass response', async () => {
  jest
    .spyOn(fetchModule, 'fetchText')
    .mockResolvedValue('4052652||way||12/30||45||3250||concrete\n');

  const apiId = { type: 'node', id: '123' };
  const query = await loadRunways(apiId);
  expect(query).toEqual([
    {
      id: '4052652',
      length: '3250',
      ref: '12/30',
      surface: 'concrete',
      type: 'way',
      width: '45',
    },
  ]);
});
