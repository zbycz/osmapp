import { LANGUAGES } from '../config.mjs';
import React from 'react';
import type { DocumentContext } from 'next/dist/shared/lib/utils';

export const getUrlForLangLinks = (ctx: DocumentContext) => {
  // NOTE: there are two bugs in vercel deployments
  // 1) the asPath contains the lang prefix, even though it shouldn't
  // 2) sometimes it adds query like ?nxtPall=node/11580044107
  // Related issue - even though it is closed: https://github.com/vercel/next.js/issues/36275

  const fixedPath = ctx.asPath
    .replace(/\?nxtPall=.*$/, '')
    .replace(/^\/[a-z]{2}(\/|$)/, '$1');

  if (fixedPath === '/' || fixedPath === '') {
    return '';
  }

  if (fixedPath.match(/^\/(node|way|relation)\/\d+$/)) {
    return fixedPath;
  }

  return false;
  // Test cases: /, /node/6, /en, /en/node/6
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
