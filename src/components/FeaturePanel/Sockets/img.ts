const typeToFilename = {
  type1: 'type1',
  type1_cable: 'type1',
  type2: 'type2',
  type2_cable: 'type2',
  schuko: 'schuko',
};

export const getImageSrc = (type: string) => {
  if (typeToFilename[type]) {
    return `/sockets/${typeToFilename[type]}.svg`;
  }
  return '/sockets/unknown.svg';
};
