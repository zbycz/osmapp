import getConfig from 'next/config';
import acceptLanguageParser from 'accept-language-parser';
import nextCookies from 'next-cookies';

// the files are not imported in main bundle
const getMessages = async (lang) =>
  (await import(`../locales/${lang}.js`)).default;

const getLangFromAcceptHeader = (ctx, languages) => {
  const header = ctx.req.headers['accept-language'];
  return acceptLanguageParser.pick(languages, header, { loose: true });
};

const DEFAULT_LANG = 'en';

const {
  publicRuntimeConfig: { languages },
} = getConfig();

const resolveCurrentLang = (ctx) => {
  const langInUrl = ctx.locale;

  // language is forced by URL prefix
  if (languages[langInUrl]) {
    ctx.res.setHeader('set-cookie', `lang=${langInUrl}; Path=/`);
    return langInUrl;
  }

  // app is usually used without lang prefix (cookie or accept-language)
  const { lang } = nextCookies(ctx);
  if (lang && languages[lang]) {
    return lang;
  }

  return getLangFromAcceptHeader(ctx, Object.keys(languages)) ?? DEFAULT_LANG;
};

export const getServerIntl = async (ctx) => {
  const lang = resolveCurrentLang(ctx);
  const vocabulary = await getMessages('vocabulary');
  const messages = lang === DEFAULT_LANG ? {} : await getMessages(lang);

  return {
    lang,
    languages,
    messages: { ...vocabulary, ...messages },
  };
};
