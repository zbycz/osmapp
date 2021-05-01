import getConfig from 'next/config';
import acceptLanguageParser from 'accept-language-parser';

const getMessages = (lang) => require(`../locales/${lang}.js`).default; // eslint-disable-line global-require,import/no-dynamic-require

const getLangFromAcceptHeader = (ctx, languages) => {
  const header = ctx.req.headers['accept-language'];
  return acceptLanguageParser.pick(languages, header, { loose: true });
};

export const getIntl = (ctx) => {
  const {
    publicRuntimeConfig: { languages, defaultLang },
  } = getConfig();
  const lang = getLangFromAcceptHeader(ctx, languages) ?? defaultLang;
  const defaultMessages = getMessages('vocabulary');
  const messages = lang === defaultLang ? {} : getMessages(lang);
  return {
    lang,
    messages: { ...defaultMessages, ...messages },
  };
};

// consider https://github.com/vinissimus/next-translate
