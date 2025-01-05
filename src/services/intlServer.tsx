import acceptLanguageParser from 'accept-language-parser';
import nextCookies from 'next-cookies';
import { LANGUAGES } from '../config.mjs';
import { Intl } from './intl';

// the files are not imported in main bundle
const getMessages = async (lang) =>
  (await import(`../locales/${lang}.js`)).default;

const getLangFromAcceptHeader = (ctx) => {
  const header = ctx.req.headers['accept-language'];
  return acceptLanguageParser.pick(Object.keys(LANGUAGES), header, {
    loose: true,
  });
};

const DEFAULT_LANG = 'en';

const resolveCurrentLang = (ctx) => {
  const langInUrl = ctx.locale;

  // language is forced by URL prefix
  if (LANGUAGES[langInUrl]) {
    ctx.res.setHeader('set-cookie', `lang=${langInUrl}; Path=/`);
    return langInUrl;
  }

  // app is usually used without lang prefix (cookie or accept-language)
  const { lang } = nextCookies(ctx);
  if (lang && LANGUAGES[lang]) {
    return lang;
  }

  return getLangFromAcceptHeader(ctx) ?? DEFAULT_LANG;
};

export const getServerIntl = async (ctx): Promise<Intl> => {
  const lang = resolveCurrentLang(ctx);
  const vocabulary = await getMessages('vocabulary');
  const messages = lang === DEFAULT_LANG ? {} : await getMessages(lang);

  return {
    lang,
    messages: { ...vocabulary, ...messages },
  };
};
