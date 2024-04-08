import * as React from 'react';
import { Image } from '../../../services/types';

interface PhotoInnerProps {
  image: Image;
}

const InnerPano: React.FC<PhotoInnerProps> = ({ image }) => {
  const pannellumUrl = `https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${encodeURIComponent(
    image.thumb,
  )}&config=${encodeURIComponent(
    'http://localhost:3000/pannellum-config.json',
  )}`;

  return (
    <>
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
    </>
  );
};

const InnerPhoto: React.FC<PhotoInnerProps> = ({ image }) => {
  if (image.isPano) {
    return <InnerPano image={image} />;
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

interface PhotoProps {
  image: Image;
  isCertain: boolean;
}

export const Photo: React.FC<PhotoProps> = ({ image, isCertain }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <InnerPhoto image={image} />
      {!isCertain && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backdropFilter: 'contrast(0.8) brightness(1.1)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.09) 76%, #5b5b5b)',
          position: 'absolute',
          width: '100%',
          height: '3rem',
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
