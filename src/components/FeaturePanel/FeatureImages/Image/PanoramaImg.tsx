import React from 'react';
import { encodeUrl } from '../../../../helpers/utils';

type Props = {
  small: string;
  large: string;
};

export const PanoramaImg = ({ small, large }: Props) => {
  const pannellumUrl = encodeUrl`/pannellum/pannellum.html#small=${small}&large=${large}`;

  return (
    <iframe
      title="panorama"
      allowFullScreen
      style={{
        borderStyle: 'none',
        width: '100%',
        height: '100%',
      }}
      src={pannellumUrl}
    />
  );
};
