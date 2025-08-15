import React from 'react';
import Script from 'next/script';
import { useMobileMode } from '../helpers';

const OPENCLIMBING_ID = process.env.NEXT_PUBLIC_HOTJAR_ID_OPENCLIMING;

export const HotJar = () => {
  const isMobileMode = useMobileMode();

  return OPENCLIMBING_ID && !isMobileMode ? (
    <Script id="hotjar-script" strategy="afterInteractive">
      {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${OPENCLIMBING_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
    </Script>
  ) : null;
};
