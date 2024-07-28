// https://canvg.js.org/examples/nodejs
import { DOMParser } from '@xmldom/xmldom';
import canvas from 'canvas';
import fetch from 'isomorphic-unfetch';
import { Canvg, presets } from 'canvg';

const preset = presets.node({ DOMParser, canvas, fetch });

export const svg2png = async (svg: string): Promise<Buffer> => {
  const picture = preset.createCanvas(800, 600);
  const ctx = picture.getContext('2d');
  const v = Canvg.fromString(ctx, svg, preset);
  await v.render(); // Render only first frame, ignoring animations.

  return picture.toBuffer();
};
