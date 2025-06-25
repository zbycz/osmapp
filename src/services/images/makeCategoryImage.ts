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
  validImages: Awaited<LoadedImage>[],
  ctx: CanvasRenderingContext2D,
) => {
  const padding = 2;
  const numImages = validImages.length;

  let numCols: number;
  let numRows: number;

  if (numImages === 1) {
    numCols = 1;
    numRows = 1;
  } else if (numImages <= 4) {
    numCols = 2;
    numRows = Math.ceil(numImages / numCols);
  } else if (numImages <= 9) {
    numCols = 3;
    numRows = Math.ceil(numImages / numCols);
  } else {
    numCols = Math.ceil(Math.sqrt(numImages));
    numRows = Math.ceil(numImages / numCols);
  }

  const totalHorizontalPadding = (numCols + 1) * padding;
  const totalVerticalPadding = (numRows + 1) * padding;

  const cellWidth = (WIDTH - totalHorizontalPadding) / numCols;
  const cellHeight = (HEIGHT - totalVerticalPadding) / numRows;

  validImages.forEach((imageObj, index) => {
    const col = index % numCols;
    const row = Math.floor(index / numCols);

    let drawX = padding + col * (cellWidth + padding);
    let drawY = padding + row * (cellHeight + padding);

    const imgAspectRatio = imageObj.width / imageObj.height;
    const cellAspectRatio = cellWidth / cellHeight;

    let finalWidth: number;
    let finalHeight: number;

    if (imgAspectRatio > cellAspectRatio) {
      finalWidth = cellWidth;
      finalHeight = cellWidth / imgAspectRatio;
    } else {
      finalHeight = cellHeight;
      finalWidth = cellHeight * imgAspectRatio;
    }

    drawX += (cellWidth - finalWidth) / 2;
    drawY += (cellHeight - finalHeight) / 2;

    ctx.drawImage(imageObj.img, drawX, drawY, finalWidth, finalHeight);
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
