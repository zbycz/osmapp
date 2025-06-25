const retina = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
const WIDTH = 300 * retina;
const HEIGHT = 238 * retina;
const PADDING = 1 * retina;

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

const findMinimalHeightColumn = (columnHeights: number[]) => {
  let minHeight = Infinity;
  let targetCol = 0;
  for (let i = 0; i < columnHeights.length; i++) {
    if (columnHeights[i] < minHeight) {
      minHeight = columnHeights[i];
      targetCol = i;
    }
  }
  return targetCol;
};

const placeImageToCanvas = (
  images: LoadedImage[],
  ctx: CanvasRenderingContext2D,
) => {
  const numCols = images.length >= 8 ? 3 : images.length >= 3 ? 2 : 1;
  const columnWidth = (WIDTH - (numCols - 1) * PADDING) / numCols;

  const columnContents: { img: LoadedImage; y: number; height: number }[][] =
    Array(numCols)
      .fill(null)
      .map(() => []);
  const columnHeights: number[] = Array(numCols).fill(0);

  // we do classic masonry here
  images.forEach((img) => {
    const height = img.height * (columnWidth / img.width);
    const targetCol = findMinimalHeightColumn(columnHeights);
    const offsetY = columnHeights[targetCol];

    if (offsetY + height <= HEIGHT) {
      columnContents[targetCol].push({ img, y: offsetY, height });
      columnHeights[targetCol] += height;
    }
  });

  for (let col = 0; col < numCols; col++) {
    const contentHeight = columnHeights[col];
    const totalYPadding = (columnContents[col].length - 1) * PADDING;
    const availibleHeight = HEIGHT - totalYPadding;

    let offsetY = 0;
    columnContents[col].forEach((item) => {
      const drawX = col * (columnWidth + PADDING);
      const cellHeight = (item.height / contentHeight) * availibleHeight;

      const imgAspect = item.img.width / item.img.height;
      const cellAspect = columnWidth / cellHeight;
      let sx = 0,
        sy = 0,
        sw = item.img.width,
        sh = item.img.height;

      if (imgAspect > cellAspect) {
        sw = item.img.height * cellAspect;
        sx = (item.img.width - sw) / 2;
      } else {
        sh = item.img.width / cellAspect;
        sy = (item.img.height - sh) / 2;
      }

      ctx.drawImage(
        item.img.img,
        sx,
        sy,
        sw,
        sh,
        drawX,
        offsetY,
        columnWidth,
        cellHeight,
      );

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
