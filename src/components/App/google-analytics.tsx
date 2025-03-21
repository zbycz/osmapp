import React from 'react';
import Script from 'next/script';

const OPENCLIMBING_ID = 'G-XCHYKP28FT';

export const GoogleAnalytics = () => (
  <>
    <Script
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtag/js?id=${OPENCLIMBING_ID}`}
    />

    <Script id="" strategy="lazyOnload">
      {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${OPENCLIMBING_ID}');
        `}
    </Script>
  </>
);
