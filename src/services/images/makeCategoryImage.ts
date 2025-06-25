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

  const totalHorizontalPadding = Math.max(0, (numCols - 1) * padding);
  const totalVerticalPadding = Math.max(0, (numRows - 1) * padding);

  const cellWidth = (WIDTH - totalHorizontalPadding) / numCols;
  const cellHeight = (HEIGHT - totalVerticalPadding) / numRows;

  validImages.forEach((imageObj, index) => {
    const col = index % numCols;
    const row = Math.floor(index / numCols);

    const dx = col * cellWidth + col * padding;
    const dy = row * cellHeight + row * padding;

    const dWidth = cellWidth;
    const dHeight = cellHeight;

    const imgAspectRatio = imageObj.width / imageObj.height;
    const cellAspectRatio = cellWidth / cellHeight;

    let sx: number;
    let sy: number;
    let sWidth: number;
    let sHeight: number;

    if (imgAspectRatio > cellAspectRatio) {
      sHeight = imageObj.height;
      sWidth = sHeight * cellAspectRatio;
      sx = (imageObj.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = imageObj.width;
      sHeight = sWidth / cellAspectRatio;
      sx = 0;
      sy = (imageObj.height - sHeight) / 2;
    }

    ctx.drawImage(
      imageObj.img,
      sx,
      sy,
      sWidth,
      sHeight,
      dx,
      dy,
      dWidth,
      dHeight,
    );
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
