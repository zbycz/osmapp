import React from 'react';
import Script from 'next/script';
import { PROJECT_ID } from '../../services/project';

const UMAMI_ID_OSMAPP = '8eb1792b-ba57-468b-a2cf-c8b050e11bb3';
const UMAMI_ID_OPENCLIMBING = '85c41d25-1a2a-4168-9786-a442a92e6171';

export const Umami = () => {
  const isOpenClimbing = PROJECT_ID === 'openclimbing';

  // we should disable tracking for osmapp in ~10/4/2025
  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={isOpenClimbing ? UMAMI_ID_OPENCLIMBING : UMAMI_ID_OSMAPP}
    />
  );
};
