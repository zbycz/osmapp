import React, { createContext, FC, useContext, useMemo } from 'react';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { TranslationId } from './types';

type Values = { [variable: string]: string };

interface IntlType {
  lang: string;
  t: (id: TranslationId, values?: Values) => string;
  Translation: FC<{ id: TranslationId; values?: Values }>;
  changeLang: (langId: string) => void;
}

export const intl = {
  lang: '',
  messages: {},
};

const VARIABLE_REGEX = /__(?<name>[a-zA-Z_]+)__/g;

const replaceValues = (text: string, values: Values) =>
  text.replace(VARIABLE_REGEX, (match, variableName) => {
    const value = values && values[variableName];
    return value != null ? value : '?';
  });

export const t = (id: TranslationId, values?: Values) => {
  const translation = intl.messages[id] ?? id;
  return replaceValues(translation, values);
};

export const Translation = ({ id, values }) => {
  const html = t(id, values);
  return <span data-id={id} dangerouslySetInnerHTML={{ __html: html }} />;
};

export const changeLang = (langId) => {
  if (langId === intl.lang) return;
  Cookies.set('lang', langId, { expires: 365, path: '/' });
  Router.reload();
};

export const IntlContext = createContext<IntlType>(undefined);

export const IntlProvider = ({ initialIntl, children }) => {
  if (initialIntl) {
    intl.lang = initialIntl.lang;
    intl.messages = initialIntl.messages;
  }

  const value = useMemo(
    () => ({
      lang: intl.lang,
      t,
      Translation,
      changeLang,
    }),
    [intl],
  );

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
};

export const useIntlContext = () => useContext(IntlContext);
