import * as React from 'react';
import { Image } from '../../../services/types';

interface PhotoProps {
  image: Image;
}

export const Photo: React.FC<PhotoProps> = ({ image }) => {
  if (image.isPano) {
    return <p>Pano</p>;
  }

  return (
    <img
      src={image.thumb}
      style={{
        objectFit: image.portrait ? 'contain' : 'cover',
        width: '100%',
        height: '100%',
      }}
      alt={`Provided by ${image.source}`}
    />
  );
};
