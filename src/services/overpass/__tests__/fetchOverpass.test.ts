import { fetchOverpass } from '../fetchOverpass';
import * as fetch from '../../fetch';

jest.mock('../../fetch', () => ({
  fetchJson: jest.fn(),
}));

// Dispatcher_Client::request_read_and_idx::protocol_error - full response looks like this: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"\n    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head>\n  <meta http-equiv="content-type" content="text/html; charset=utf-8" lang="en"/>\n  <title>OSM3S Response</title>\n</head>\n<body>\n\n<p>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</p>\n<p><strong style="color:#FF0000">Error</strong>: runtime error: open64: 0 Success /osm3s_osm_base Dispatcher_Client::request_read_and_idx::protocol_error </p>\n\n</body>\n</html>\n'
const throwParseError = () => {
  throw new Error(
    'fetchJson: parse error: Unexpected token \'<\', "<?xml vers"... is not valid JSON, in "<?xml version="1.0"',
  );
};

const exampleResponse = { elements: ['fake node'] };

describe('fetchOverpass', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retries when overpass is busy', async () => {
    const fetchJson = (jest.spyOn(fetch, 'fetchJson') as unknown as jest.Mock)
      .mockImplementationOnce(throwParseError)
      .mockResolvedValueOnce(exampleResponse);

    const res = await fetchOverpass('[out:json];node(1);out;');

    expect(fetchJson).toHaveBeenCalledTimes(2);
    expect(res).toEqual(exampleResponse);
  });
});
