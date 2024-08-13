import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import { renderToString } from 'react-dom/server';
import { CacheProvider } from '@emotion/react';
import React from 'react';

export const renderStyledHtml = (node: React.ReactNode) => {
  const cache = createCache({ key: 'custom' });
  // @ts-ignore
  const emo = createEmotionServer(cache);
  const html = renderToString(
    <CacheProvider value={cache}>{node}</CacheProvider>,
  );
  const chunks = emo.extractCriticalToChunks(html);
  const styleTags = emo.constructStyleTagsFromChunks(chunks);
  return { html, styleTags };
};
