import type { NextApiRequest, NextApiResponse } from 'next';
import sizeOf from 'image-size';
import React from 'react';
import { renderToString } from 'react-dom/server';
import fetch from 'isomorphic-unfetch';
import { ServerStyleSheet } from 'styled-components';
import { svg2png } from 'svg-png-converter';
import fs from 'fs/promises';
import { UserThemeProvider } from '../../src/helpers/theme';
import { PathsSvgInner } from '../../src/components/FeaturePanel/ImagePane/Paths';
import {
  Feature,
  ImageDefFromCenter,
  ImageDefFromTag,
  isTag,
} from '../../src/services/types';
import { fetchFeature } from '../../src/services/osmApi';
import { getShortId } from '../../src/services/helpers';
import { getImageFromApi } from '../../src/services/images/getImageFromApi';
import { Size } from '../../src/components/FeaturePanel/ImagePane/types';

const fetchImage = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const size = sizeOf(buffer) as Size;

  const base64String = Buffer.from(buffer).toString('base64');
  const imageUrlBase64 = `data:image/jpeg;base64,${base64String}`;
  return { size, imageUrlBase64 };
};

const PNG_TYPE = {
  suffix: '.png',
  contentType: 'image/png',
};
const SVG_TYPE = {
  suffix: '.svg',
  contentType: 'image/svg+xml',
};

const sendImageResponse = (
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

// TODO merge with prod
export const PathSvg = ({ children, size, xmlns = null }) => (
  <svg
    viewBox={`0 0 ${size.width} ${size.height}`}
    width={size.width}
    height={size.height}
    // preserveAspectRatio="none"
    xmlns={xmlns}
  >
    {children}
  </svg>
);

const moveLogo = (climbing: boolean, canvas: Size) => {
  const width = climbing ? 40 : 53;
  const offset = climbing ? 50 : 55;
  const top = canvas.width - offset;
  const left = canvas.height - offset;
  return `translate(${top},${left}) scale(${width / 256})`;
};

const getLogo = async (climbing: boolean, canvas: Size) => {
  const path = climbing
    ? 'public/openclimbing/logo/openclimbing.svg'
    : 'public/osmapp/logo/osmapp.svg';
  const logo = await fs.readFile(path);
  const svg = logo.toString('utf-8');
  const transform = moveLogo(climbing, canvas);
  return { svg, transform };
};

const renderSvg = (
  size: Size,
  imageUrlBase64: string,
  def: ImageDefFromTag | ImageDefFromCenter,
  feature: Feature,
  logo,
) => {
  const Root = () => (
    <UserThemeProvider userThemeCookie={undefined}>
      <PathSvg xmlns="http://www.w3.org/2000/svg" size={size}>
        __PLACEHOLDER_FOR_STYLE__
        <image href={imageUrlBase64} width="100%" height="100%" />
        {isTag(def) && (
          <PathsSvgInner def={def} feature={feature} size={size} />
        )}
        <g
          transform={logo.transform}
          dangerouslySetInnerHTML={{ __html: logo.svg }} // eslint-disable-line react/no-danger
        />
      </PathSvg>
    </UserThemeProvider>
  );

  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Root />));
  const styleTags = sheet.getStyleTags();
  return html.replace('__PLACEHOLDER_FOR_STYLE__', styleTags);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const feature = await fetchFeature(id);
    const def = feature.imageDefs[0]; // TODO
    if (!def) {
      throw new Error('No image definition found');
    }

    const image = await getImageFromApi(def);
    const { size, imageUrlBase64 } = await fetchImage(image.imageUrl);
    const logo = await getLogo(!feature.tags.climbing, size);
    const svg = renderSvg(size, imageUrlBase64, def, feature, logo);

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
