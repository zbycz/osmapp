export const getImageSrc = (type: string) => {
  switch (type) {
    case 'type2':
      return '/sockets/type2.svg';
    case 'schuko':
      return '/sockets/schuko.svg';
    default:
      return '/sockets/unknown.svg';
  }
};
