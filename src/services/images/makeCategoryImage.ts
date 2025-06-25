const WIDTH = 300;
const HEIGHT = 238;
const PADDING = 2;

type LoadedImage = {
  img: HTMLImageElement;
  width: number;
  height: number;
};

const loadImage = (url: string) =>
  new Promise<LoadedImage>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve({ img, width: img.width, height: img.height });
    img.onerror = () => resolve(null);
    img.src = url;
  });

const loadImages = async (thumbsUrls: string[]) => {
  const images = await Promise.all(thumbsUrls.map(loadImage));
  return images.filter((item) => item && item.width > 0 && item.height > 0);
};

const placeImageToCanvas = (
  validImages: LoadedImage[],
  ctx: CanvasRenderingContext2D,
) => {
  const numCols = validImages.length >= 8 ? 3 : validImages.length >= 3 ? 2 : 1;
  const columnWidth = (WIDTH - (numCols - 1) * PADDING) / numCols;

  const columnContents: { img: LoadedImage; y: number; height: number }[][] =
    Array(numCols)
      .fill(null)
      .map(() => []);
  const columnHeights: number[] = Array(numCols).fill(0);

  validImages.forEach((img) => {
    let minHeight = Infinity;
    let targetCol = 0;
    for (let i = 0; i < numCols; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        targetCol = i;
      }
    }

    const height = img.height * (columnWidth / img.width);
    const y = columnHeights[targetCol];

    if (y + height <= HEIGHT) {
      columnContents[targetCol].push({ img, y, height });
      columnHeights[targetCol] += height;
    }
  });

  for (let col = 0; col < numCols; col++) {
    const columnHeight = columnHeights[col];
    const totalYPadding = (columnContents[col].length - 1) * PADDING;
    const availibleHeight = HEIGHT - totalYPadding;

    let offsetY = 0;
    columnContents[col].forEach((item) => {
      const drawX = col * (columnWidth + PADDING);
      const cellHeight = (item.height / columnHeight) * availibleHeight;

      ctx.drawImage(item.img.img, drawX, offsetY, columnWidth, cellHeight);
      offsetY += cellHeight + PADDING;
    });
  }
};

export const makeCategoryImage = async (
  thumbsUrls: string[],
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const validImages = await loadImages(thumbsUrls);
  if (validImages.length === 0) {
    return null;
  }

  placeImageToCanvas(validImages, ctx);

  return canvas.toDataURL('image/jpeg', 0.8);
};
