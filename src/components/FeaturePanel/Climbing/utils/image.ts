export const getContainedSizeImage = (image) => {
  const ratio =
    image.naturalHeight === 0 ? 0 : image.naturalWidth / image.naturalHeight;
  let width = image.height * ratio;
  let { height } = image;

  if (width > image.width) {
    width = image.width;
    height = image.width / ratio;
  }

  return [width, height];
};
