import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchFeature } from '../../src/services/osmApi';
import { getInstantImage } from '../../src/services/images/getImageDefs';
import { isInstant } from '../../src/services/types';
import {
  Paths,
  PathsSvgInner,
  PathSvg,
} from '../../src/components/FeaturePanel/ImagePane/Paths';
import * as url from 'node:url';
import * as https from 'node:https';
import sizeOf from 'image-size';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UserThemeProvider } from '../../src/helpers/theme';

const getImageSizeServer = async (imageUrl: string) => {
  return new Promise((resolve, reject) => {
    const options = url.parse(imageUrl);
    options.path = encodeURI(options.path);

    https.get(options, function (response) {
      const chunks = [];
      response
        .on('data', function (chunk) {
          chunks.push(chunk);
        })
        .on('end', function () {
          const buffer = Buffer.concat(chunks);
          resolve(sizeOf(buffer));
        })
        .on('error', reject);
    });
  });
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
        <PathSvg size={size}>
          <image href={image.imageUrl} width="100%" height="100%" />
          <PathsSvgInner def={def} feature={feature} size={size} />
        </PathSvg>
      </UserThemeProvider>
    );
    const html = renderToString(<Root />);

    res.status(200).setHeader('Content-Type', 'image/svg').send(html);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
