import { fetchOverpass } from '../fetchOverpass';
import * as fetch from '../../fetch';
import { FetchError } from '../../helpers';

jest.mock('../../fetch', () => ({
  fetchJson: jest.fn(),
}));

const throwProtocolError = () => {
  throw new FetchError(
    'Dispatcher_Client::request_read_and_idx::protocol_error',
    '502',
    'DATA',
  );
};

const exampleResponse = { elements: ['fake node'] };

describe('fetchOverpass', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retries when overpass is busy', async () => {
    const fetchJson = (jest.spyOn(fetch, 'fetchJson') as unknown as jest.Mock)
      .mockImplementationOnce(throwProtocolError)
      .mockResolvedValueOnce(exampleResponse);

    const res = await fetchOverpass('[out:json];node(1);out;');

    expect(fetchJson).toHaveBeenCalledTimes(2);
    expect(res).toEqual(exampleResponse);
  });
});
