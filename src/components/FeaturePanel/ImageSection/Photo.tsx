import * as React from 'react';
import { Image } from '../../../services/types';

interface PhotoProps {
  image: Image;
}

export const Photo: React.FC<PhotoProps> = ({ image }) => {
  if (image.isPano) {
    const pannellumUrl = `https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${encodeURIComponent(
      image.thumb,
    )}&autoLoad=true`;

    return (
      <iframe
        title="panorama picture"
        allowFullScreen
        style={{
          borderStyle: 'none',
          width: '100%',
          height: '100%',
        }}
        src={pannellumUrl}
      />
    );
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
