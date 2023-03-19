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

const getLangFromCtx = (ctx) => {
  const { lang } = nextCookies(ctx);
  if (lang && languages[lang]) return lang;

  return getLangFromAcceptHeader(ctx, Object.keys(languages)) ?? DEFAULT_LANG;
};

export const getServerIntl = async (ctx) => {
  const lang = getLangFromCtx(ctx);
  const vocabulary = await getMessages('vocabulary');
  const messages = lang === DEFAULT_LANG ? {} : await getMessages(lang);
  const intl = {
    lang,
    languages,
    messages: { ...vocabulary, ...messages },
  };
  return intl;
};
