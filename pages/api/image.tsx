import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchFeature } from '../../src/services/osmApi';
import { getInstantImage } from '../../src/services/images/getImageDefs';
import { isInstant } from '../../src/services/types';
import {
  PathsSvgInner,
} from '../../src/components/FeaturePanel/ImagePane/Paths';
import sizeOf from 'image-size';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UserThemeProvider } from '../../src/helpers/theme';
import fetch from 'isomorphic-unfetch';

const getImageSizeServer = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  return sizeOf(buffer);
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const feature = await fetchFeature(id);

    const instantDefs = feature.imageDefs.filter(isInstant);
    const def = instantDefs[0];
    const image = getInstantImage(def.k, def.v);
    console.log(image);

    const size = await getImageSizeServer(image.imageUrl);
    console.log(size);

    const Root = () => (
      <UserThemeProvider userThemeCookie={undefined}>
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          width={size.width}
          height={size.height}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <image href={image.imageUrl} width="100%" height="100%" />
          <PathsSvgInner def={def} feature={feature} size={size} />
        </svg>
      </UserThemeProvider>
    );
    const html = renderToString(<Root />);

    res
      .status(200)
      .setHeader('X-Clacks-Overhead', 'GNU Terry Pratchett')
      .setHeader('Content-Type', 'image/svg+xml')
      .setHeader(
        'Content-Disposition',
        `inline; filename="your-image-name.svg"`,
      )
      .send(html);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
