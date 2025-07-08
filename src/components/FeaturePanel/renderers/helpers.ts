export const protocol = /^\w+:\/\//;
export const displayForm = (url: string) =>
  decodeURI(url.replace(protocol, '').replace(/([^/]+)\/$/, '$1'));
