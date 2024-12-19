import { LANGUAGES } from '../config.mjs';
import React from 'react';
import type { DocumentContext } from 'next/dist/shared/lib/utils';

export const getUrlForLangLinks = (ctx: DocumentContext) => {
  // NOTE: only on deployed vercel, the asPath sometimes contains the lang prefix, even though it shouldn't
  // we print LangLinks only for basic node/way/relation pages
  const matches = ctx.asPath.match(
    /^\/(?:[a-z]{2})?(\/(?:node|way|relation)\/\d+)$/,
  );
  return matches ? matches[1] : false;
};

type Props = {
  urlForLangLinks: string | false;
};

export const LangLinks = ({ urlForLangLinks }: Props) =>
  urlForLangLinks ? (
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
  ) : null;
