import fetch from 'isomorphic-unfetch';
import sizeOf from 'image-size';
import type { NextApiResponse } from 'next';
import fs from 'fs/promises';
import React from 'react';
import { Size } from '../components/FeaturePanel/ImagePane/types';
import { Feature } from './types';
import { getShortId } from './helpers';

export const fetchImage = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const size = sizeOf(buffer) as Size;

  const base64String = Buffer.from(buffer).toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64String}`;
  return { size, dataUrl };
};

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

const moveLogo = (climbing: boolean, { height, width }: Size) => {
  const target = climbing ? 40 : 53;
  const offset = climbing ? 50 : 55;
  const top = width - offset;
  const left = height - offset;
  return `translate(${top},${left}) scale(${target / 256})`;
};
export const getLogo = async (canvas: Size, climbing: boolean) => {
  const path = climbing
    ? 'public/openclimbing/logo/openclimbing.svg'
    : 'public/osmapp/logo/osmapp.svg';
  const logo = await fs.readFile(`${process.env.PWD}/${path}`);
  const svg = logo.toString('utf-8');
  const transform = moveLogo(climbing, canvas);
  return { svg, transform };
};
type ProjectLogoProps = {
  logo: { transform: string; svg: string };
};
export const ProjectLogo = ({ logo }: ProjectLogoProps) => (
  <g
    transform={logo.transform}
    dangerouslySetInnerHTML={{ __html: logo.svg }} // eslint-disable-line react/no-danger
  />
);
