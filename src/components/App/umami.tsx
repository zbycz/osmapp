import React from 'react';
import Script from 'next/script';

const UMAMI_ID = '85c41d25-1a2a-4168-9786-a442a92e6171';

export const Umami = () => (
  <Script
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id={UMAMI_ID}
  />
);
