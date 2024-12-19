import { LANGUAGES } from '../config.mjs';
import React from 'react';
import type { DocumentContext } from 'next/dist/shared/lib/utils';

export const getUrlForLangLinks = (ctx: DocumentContext) => {
  // NOTE: there is bug in vercel deployments – the asPath contains the lang prefix, even though it shouldn't
  // Here we make sure the lang prefix is removed.
  // Related issue - even though it is closed: https://github.com/vercel/next.js/issues/36275

  const fixedPath = ctx.asPath.replace(/^\/[a-z]{2}(\/|^)/, '$1');
  console.log('fixedPath', fixedPath);
  if (fixedPath === '/') {
    return '';
  }

  const matches = fixedPath.match(/^\/(?:node|way|relation)\/\d+$/);
  console.log('matches', matches);
  return matches ? `${matches[0]}` : false;
};

type Props = {
  urlForLangLinks: string | false;
};

export const LangLinks = ({ urlForLangLinks }: Props) =>
  urlForLangLinks === false ? null : (
    <>
      {/* only for bots - we dont need to change this after SSR: */}
      {Object.keys(LANGUAGES).map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`/${lang}${urlForLangLinks}`}
        />
      ))}
    </>
  );
