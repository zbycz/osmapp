const WIDTH = 300;
const HEIGHT = 238;

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
  const padding = 2;
  const numCols = 3;
  const columnWidth = (WIDTH - (numCols - 1) * padding) / numCols;

  const columnHeights = Array(numCols).fill(0);

  validImages.forEach((imageObj) => {
    let minHeight = Infinity;
    let targetCol = 0;
    for (let i = 0; i < numCols; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        targetCol = i;
      }
    }

    const scaledHeight = imageObj.height * (columnWidth / imageObj.width);

    const drawX = targetCol * (columnWidth + padding);
    const drawY = columnHeights[targetCol];

    if (drawY + scaledHeight > HEIGHT) {
      return;
    }

    ctx.drawImage(imageObj.img, drawX, drawY, columnWidth, scaledHeight);

    columnHeights[targetCol] += scaledHeight + padding;
  });
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
