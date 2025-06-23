import React from 'react';
import Script from 'next/script';
import { PROJECT_ID } from '../../services/project';

export const Umami = () => {
  const isOpenClimbing = PROJECT_ID === 'openclimbing';
  const websiteId = isOpenClimbing
    ? process.env.NEXT_PUBLIC_UMAMI_ID_OPENCLIMBING
    : process.env.NEXT_PUBLIC_UMAMI_ID_OSMAPP;

  if (!websiteId || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
    />
  );
};
