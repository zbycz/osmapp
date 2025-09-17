import { getFullOsmappLink } from '../../../services/helpers';
import { getLastCommonKeyIndex } from '../Climbing/utils/photo';
import { Feature } from '../../../services/types';

const CLIMBING_VALUES_FOR_AUTO_ADDING_WEBSITE = ['area', 'crag'];

const addOpenClimbingWebsite = (feature: Feature, currentUrl: string) => {
  const nextWebsiteIndex = getLastCommonKeyIndex(feature.tags, 'website') + 1;
  if (nextWebsiteIndex === 1) {
    const tags = {
      ...feature.tags,
      website: currentUrl,
    };

    return {
      ...feature,
      tags,
      tagsEntries: Object.entries(tags),
    };
  }

  const newKey = `website:${nextWebsiteIndex}`;
  const tags = {
    ...feature.tags,
    website: currentUrl,
    [newKey]: feature.tags.website,
  };

  return {
    ...feature,
    tags,
    tagsEntries: Object.entries(tags),
  };
};

export const addWebsiteForClimbingFeature = (feature: Feature) => {
  if (CLIMBING_VALUES_FOR_AUTO_ADDING_WEBSITE.includes(feature.tags.climbing)) {
    const currentUrl = getFullOsmappLink(feature);
    const isWebsiteAlreadyAdded = Object.keys(feature.tags).some(
      (tag) =>
        tag.startsWith('website') && feature.tags[tag].startsWith(currentUrl),
    );

    if (!isWebsiteAlreadyAdded && feature.osmMeta.id > 0) {
      return addOpenClimbingWebsite(feature, currentUrl);
    }
  }
  return feature;
};
