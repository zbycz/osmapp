import React from 'react';
import Script from 'next/script';
import { PROJECT_ID } from '../../services/project';

export const Umami = () => {
  const isOpenClimbing = PROJECT_ID === 'openclimbing';

  // we should disable tracking for osmapp in ~10/4/2025
  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={
        isOpenClimbing
          ? process.env.NEXT_PUBLIC_UMAMI_ID_OPENCLIMBING
          : process.env.NEXT_PUBLIC_UMAMI_ID_OSMAPP
      }
    />
  );
};
