import { mergeResultFn } from '../useLoadImages';
import { ImageDef } from '../../../../services/types';
import { ImageType } from '../../../../services/images/getImageDefs';

jest.mock('maplibre-gl', () => ({}));

const def1: ImageDef = { type: 'tag', k: 'key', v: '1', instant: false };
const def2: ImageDef = { type: 'tag', k: 'key2', v: '2', instant: false };
const def3: ImageDef = { type: 'tag', k: 'key3', v: '3', instant: false };
const image1 = { imageUrl: '1.jpg' } as ImageType;
const image2 = { imageUrl: '2.jpg' } as ImageType;
const image2b = { imageUrl: '2.jpg', link: 'different source' } as ImageType;

describe('mergeResultFn', () => {
  it('should merge to sameUrlResolvedAlsoFrom', () => {
    const prevImages = [
      { def: def1, images: [image1] },
      { def: def2, images: [image2] },
    ];
    const result = mergeResultFn(def3, [image2b], [])(prevImages);
    expect(result).toEqual([
      { def: def1, images: [image1] },
      {
        def: def2,
        images: [
          {
            ...image2,
            sameUrlResolvedAlsoFrom: [image2b],
          },
        ],
      },
    ]);
  });

  it('should sort images', () => {
    const defs = [def1, def2, def3];
    const prevImages = [{ def: def2, images: [image2] }];

    const result = mergeResultFn(def1, [image1], defs)(prevImages);
    expect(result).toEqual([
      { def: def1, images: [image1] },
      { def: def2, images: [image2] },
    ]);
  });
});
