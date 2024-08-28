import { getName, getTypeLabel } from '../../helpers/featureLabel';
import type { Feature } from '../../services/types';
import { File } from './types';

import { isTitleAvailable } from './mediawiki/isTitleAvailable';

export const getTitle = (feature: Feature, file: File) => {
  const name = getName(feature);
  const presetName = getTypeLabel(feature);
  const location = file.location ?? feature.center;
  return name
    ? `${name} (${presetName})`
    : `${presetName} at ${location.map((x) => x.toFixed(5))}`;
};

export const getFilename = (feature: Feature, file: File, suffix: string) => {
  const title = getTitle(feature, file);

  const extension = file.filename.split('.').pop();
  return `${title} - OsmAPP${suffix}.${extension}`;
};

export async function findFreeSuffix(feature: Feature, file: File) {
  for (let i = 1; i < 20; i++) {
    const suffix = i === 1 ? '' : ` (${i})`;
    const filename = getFilename(feature, file, suffix);
    const isFree = await isTitleAvailable(`File:${filename}`);
    if (isFree) {
      return suffix;
    }
  }

  throw new Error(`Could not find 20 free suffixes for ${file.filename}`);
}
