import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { svg2png } from 'svg-png-converter';
import { UserThemeProvider } from '../../src/helpers/theme';
import { Paths } from '../../src/components/FeaturePanel/ImagePane/PathsSvg';
import {
  Feature,
  ImageDefFromCenter,
  ImageDefFromTag,
} from '../../src/services/types';
import { fetchFeature } from '../../src/services/osmApi';
import { getImageFromApi } from '../../src/services/images/getImageFromApi';
import { getLogo, ProjectLogo } from '../../src/server/images/logo';
import { ImageType } from '../../src/services/images/getImageDefs';
import { fetchImage } from '../../src/server/images/fetchImage';
import {
  PNG_TYPE,
  sendImageResponse,
  SVG_TYPE,
} from '../../src/server/images/sendImageResponse';

const Svg = ({ children, size }) => (
  <UserThemeProvider userThemeCookie={undefined}>
    <svg
      viewBox={`0 0 ${size.width} ${size.height}`}
      width={size.width}
      height={size.height}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  </UserThemeProvider>
);

const renderSvg = async (
  feature: Feature,
  def: ImageDefFromTag | ImageDefFromCenter,
  image: ImageType,
) => {
  const { size, dataUrl } = await fetchImage(image.imageUrl);
  const logo = getLogo(size, !!feature.tags.climbing);

  const Root = () => (
    <Svg size={size}>
      __PLACEHOLDER_FOR_STYLE__
      <image href={dataUrl} width="100%" height="100%" />
      <Paths def={def} feature={feature} size={size} />
      <ProjectLogo logo={logo} />
    </Svg>
  );

  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Root />));
  const styleTags = sheet.getStyleTags();
  return html.replace('__PLACEHOLDER_FOR_STYLE__', styleTags);
};

// this function takes ~100ms + network
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const feature = await fetchFeature(id);
    const def = feature.imageDefs?.[0]; // TODO iterate when first not found
    if (!def) {
      throw new Error('No image definition found');
    }

    const image = await getImageFromApi(def);
    if (!image) {
      throw new Error(`Image failed to load from API: ${JSON.stringify(def)}`);
    }
    const svg = await renderSvg(feature, def, image);

    if (req.query.svg) {
      sendImageResponse(res, feature, svg, SVG_TYPE);
      return;
    }

    const png = await svg2png({
      input: svg,
      encoding: 'buffer',
      format: 'png',
    });

    sendImageResponse(res, feature, png, PNG_TYPE);
    return;
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
