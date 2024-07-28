import fetch from 'isomorphic-unfetch';
import sizeOf from 'image-size';
import { Size } from '../../components/FeaturePanel/ImagePane/types';

export const fetchImage = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const size = sizeOf(buffer) as Size;

  const base64String = Buffer.from(buffer).toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64String}`;
  return { size, dataUrl };
};
