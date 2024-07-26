import * as fetchModule from '../../../../services/fetch';
import { requestLines } from '../requestRoutes';

test('conversion', async () => {
  jest
    .spyOn(fetchModule, 'fetchText')
    .mockResolvedValue('U5;#7E5330\nU5;#7E5330\n');

  const features = await requestLines('node', 3862767512);

  features.forEach((feature) => {
    expect(feature).toHaveProperty('ref');
    expect(feature.ref).not.toBe('');
    expect(feature.ref).toEqual(expect.any(String));
    expect(feature).toHaveProperty('colour');
    expect(
      typeof feature.colour === 'string' || feature.colour === undefined,
    ).toBeTruthy();
  });
});
