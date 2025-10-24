import { EditDataItem } from '../EditDialog/context/types';
import { getFullLinkFromEditDataItem } from '../../../services/helpers';
import { getLastCommonKeyIndex } from '../Climbing/utils/photo';

const CLIMBING_VALUES_FOR_AUTO_ADDING_WEBSITE = ['area', 'crag'];

const addOpenClimbingWebsite = (item: EditDataItem, currentUrl: string) => {
  const nextWebsiteIndex = getLastCommonKeyIndex(item.tags, 'website') + 1;
  if (nextWebsiteIndex === 1) {
    return {
      ...item,
      tags: {
        ...item.tags,
        website: currentUrl,
      },
    };
  }

  const newKey = `website:${nextWebsiteIndex}`;

  return {
    ...item,
    tags: {
      ...item.tags,
      website: currentUrl,
      [newKey]: item.tags.website,
    },
  };
};

export const addWebsiteForClimbingFeatures = (items: EditDataItem[]) => {
  return items.map((item) => {
    if (CLIMBING_VALUES_FOR_AUTO_ADDING_WEBSITE.includes(item.tags.climbing)) {
      const currentUrl = getFullLinkFromEditDataItem(item);
      const isWebsiteAlreadyAdded = Object.keys(item.tags).some(
        (tag) =>
          tag.startsWith('website') && item.tags[tag].startsWith(currentUrl),
      );

      if (!isWebsiteAlreadyAdded) {
        return addOpenClimbingWebsite(item, currentUrl);
      }
    }
    return item;
  });
};
