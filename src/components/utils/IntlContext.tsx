import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { TranslationKey } from './types';

interface IntlType {
  lang: string;
  t: (key: TranslationKey) => string;
  // messages: { [key: string]: string };  // import ./types and there import en.json
}

export const IntlContext = createContext<IntlType>(undefined);

export const IntlProvider = ({ initialIntl, children }) => {
  const { lang, messages } = useMemo(() => initialIntl, []);
  const translate = useCallback((key: string) => messages[key] ?? key, [
    messages,
  ]);

  const value = {
    lang,
    t: translate,
  };

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
};

export const useIntlContext = () => useContext(IntlContext);
