import getConfig from 'next/config';
import acceptLanguageParser from 'accept-language-parser';
import nextCookies from 'next-cookies';
import vocabulary from '../locales/vocabulary';

const getMessages = (lang) => require(`../locales/${lang}.js`).default; // eslint-disable-line global-require,import/no-dynamic-require

const getLangFromAcceptHeader = (ctx, languages) => {
  const header = ctx.req.headers['accept-language'];
  return acceptLanguageParser.pick(languages, header, { loose: true });
};

const DEFAULT_LANG = 'en';

const {
  publicRuntimeConfig: { languages },
} = getConfig();

const getLangFromCtx = (ctx) => {
  const { lang } = nextCookies(ctx);
  if (lang && languages[lang]) return lang;

  return getLangFromAcceptHeader(ctx, Object.keys(languages)) ?? DEFAULT_LANG;
};

export const getServerIntl = (ctx) => {
  const lang = getLangFromCtx(ctx);
  const messages = lang === DEFAULT_LANG ? {} : getMessages(lang);
  return {
    lang,
    messages: { ...vocabulary, ...messages },
  };
};

// This file is run in Server side environment only
