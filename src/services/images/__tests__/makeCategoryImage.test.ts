import { placeImageToCanvas } from '../makeCategoryImage';

const extractXY = (call) => [call[5], call[6]];
const mockImage = (url: string) => {
  const [width, height] = url.split('x').map(Number);
  return { width, height } as unknown as HTMLImageElement;
};

describe('placeImageToCanvas', () => {
  it('1 image', () => {
    const images = ['410x120'].map(mockImage);
    const ctxMock = { drawImage: jest.fn() };
    placeImageToCanvas(images, ctxMock as unknown as CanvasRenderingContext2D);

    expect(ctxMock.drawImage).toHaveBeenCalledWith(
      { height: 120, width: 410 },
      129.36974789915968,
      0,
      151.26050420168067,
      120,
      0,
      0,
      300,
      238,
    );
  });

  it('1 column', () => {
    const images = ['410x120', '410x150'].map(mockImage);
    const ctxMock = { drawImage: jest.fn() };
    placeImageToCanvas(images, ctxMock as unknown as CanvasRenderingContext2D);

    expect(ctxMock.drawImage.mock.calls.map(extractXY)).toEqual([
      [0, 0],
      [0, 106.88888888888889],
    ]);
  });

  it('2 columns', () => {
    const images = ['410x120', '410x150', '410x90'].map(mockImage);
    const ctxMock = { drawImage: jest.fn() };
    placeImageToCanvas(images, ctxMock as unknown as CanvasRenderingContext2D);

    expect(ctxMock.drawImage.mock.calls.map(extractXY)).toEqual([
      [0, 0],
      [0, 136.8571428571429],
      [151, 0],
    ]);
  });

  it('3 columns', () => {
    const images = new Array(20).fill('410x90').map(mockImage);
    const ctxMock = { drawImage: jest.fn() };
    placeImageToCanvas(images, ctxMock as unknown as CanvasRenderingContext2D);

    expect(ctxMock.drawImage.mock.calls.map(extractXY)).toEqual([
      [0, 0],
      [0, 34.285714285714285],
      [0, 68.57142857142857],
      [0, 102.85714285714286],
      [0, 137.14285714285714],
      [0, 171.42857142857142],
      [0, 205.7142857142857],
      [100.66666666666667, 0],
      [100.66666666666667, 34.285714285714285],
      [100.66666666666667, 68.57142857142857],
      [100.66666666666667, 102.85714285714286],
      [100.66666666666667, 137.14285714285714],
      [100.66666666666667, 171.42857142857142],
      [100.66666666666667, 205.7142857142857],
      [201.33333333333334, 0],
      [201.33333333333334, 40],
      [201.33333333333334, 80],
      [201.33333333333334, 120],
      [201.33333333333334, 160],
      [201.33333333333334, 200],
    ]);
  });
});
