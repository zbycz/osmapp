import { DataItem } from '../EditDialog/context/types';
import { getApiId, getUrlOsmId } from '../../../services/helpers';

const getUrl = (dataItem: DataItem) =>
  `https://openclimbing.org/${getUrlOsmId(getApiId(dataItem.shortId))}`;

const isWebsite = ([k]: [string, string]) => k.startsWith('website');

const naturalKeySorter = ([a]: string[], [b]: string[]) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const safeParseInt = (value: string | undefined): number => {
  const num = parseInt(value ?? '0', 10);
  return Number.isNaN(num) ? 0 : num;
};

const getNextNum = (websiteTags: [string, string][]) => {
  return (
    1 +
    websiteTags.reduce(
      (acc, [k]) => Math.max(acc, safeParseInt(k.split(':', 2)[1])),
      0,
    )
  );
};

export const addWebsite = (dataItem: DataItem): DataItem => {
  const websiteTags = dataItem.tagsEntries.filter(isWebsite);
  const url = getUrl(dataItem);

  const hasOpenclimbing = websiteTags.some(([k, v]) => v === url);
  if (hasOpenclimbing) {
    return dataItem;
  }

  const sortedWebsiteTags = websiteTags.sort(naturalKeySorter);

  const nextNum = getNextNum(sortedWebsiteTags);
  // for (let i = 0; i < sortedWebsiteTags.length; i++) {
  //   const [k, v] = sortedWebsiteTags[i];
  //
  //   const match = k.match(/^website(?::(\d+))?$/);
  //   if (match) {
  //     const num = match[1] ? parseInt(match[1], 10) + 1 : 1;
  //     result.push(`website:${num} ${rest.join(' ')}`);
  //   }
  // }
  sortedWebsiteTags.push([`website:${nextNum}`, url]);

  return {
    ...dataItem,
    tagsEntries: Object.entries({
      ...Object.fromEntries(dataItem.tagsEntries),
      ...Object.fromEntries(sortedWebsiteTags),
    }),
  };
};
