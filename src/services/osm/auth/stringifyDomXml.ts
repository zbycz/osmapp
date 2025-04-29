import { isString } from '../../../components/helpers';

export const stringifyDomXml = (itemXml: Node) => {
  if (isString(itemXml)) {
    throw new Error('String given');
  }
  return new XMLSerializer().serializeToString(itemXml);
};
