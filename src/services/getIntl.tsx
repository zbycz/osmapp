import getConfig from 'next/config';
import acceptLanguageParser from 'accept-language-parser';
import nextCookies from 'next-cookies';

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

export const getIntl = (ctx) => {
  const lang = getLangFromCtx(ctx);
  const defaultMessages = getMessages('vocabulary');
  const messages = lang === DEFAULT_LANG ? {} : getMessages(lang);
  return {
    lang,
    messages: { ...defaultMessages, ...messages },
  };
};

// consider https://github.com/vinissimus/next-translate
