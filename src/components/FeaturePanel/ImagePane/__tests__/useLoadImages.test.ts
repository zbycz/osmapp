import { mergeResultFn } from '../useLoadImages';

jest.mock('maplibre-gl', () => ({}));

describe('mergeResultFn', () => {
  it('should merge to sameUrlResolvedAlsoFrom', () => {
    const prevImages = [
      { def: 'def1', image: { imageUrl: 'url1' } },
      { def: 'def2', image: { imageUrl: 'url2' } },
    ];
    const image = { imageUrl: 'url1' };
    const def = 'def1';
    const result = mergeResultFn(def, image)(prevImages);
    expect(result).toEqual([
      {
        def: 'def1',
        image: {
          imageUrl: 'url1',
          sameUrlResolvedAlsoFrom: [{ imageUrl: 'url1' }],
        },
      },
      { def: 'def2', image: { imageUrl: 'url2' } },
    ]);
  });
});
