import type { NextApiResponse } from 'next';
import { Feature } from '../../services/types';
import { getShortId } from '../../services/helpers';

export const PNG_TYPE = {
  suffix: '.png',
  contentType: 'image/png',
};
export const SVG_TYPE = {
  suffix: '.svg',
  contentType: 'image/svg+xml',
};
export const sendImageResponse = (
  res: NextApiResponse,
  feature: Feature,
  content: string | Buffer,
  { suffix, contentType }: typeof PNG_TYPE | typeof SVG_TYPE,
) => {
  const filename = getShortId(feature.osmMeta) + suffix;
  res
    .status(200)
    .setHeader('X-Clacks-Overhead', 'GNU Terry Pratchett')
    .setHeader('Content-Type', contentType)
    .setHeader('Content-Disposition', `inline; filename="${filename}"`)
    .send(content);
};
