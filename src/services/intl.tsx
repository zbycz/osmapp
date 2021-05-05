import React from 'react';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { MessagesType, TranslationId } from './types';
import { isBrowser } from '../components/helpers';

type Values = { [variable: string]: string };

interface Intl {
  lang: string;
  messages: MessagesType | {};
}

export const intl: Intl = {
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

interface Props {
  id: TranslationId;
  values?: Values;
}

export const Translation = ({ id, values }: Props) => {
  const html = t(id, values);
  return <span data-id={id} dangerouslySetInnerHTML={{ __html: html }} />; // eslint-disable-line react/no-danger
};

export const changeLang = (langId: string) => {
  if (langId === intl.lang) return;
  Cookies.set('lang', langId, { expires: 365, path: '/' });
  Router.reload();
};

export const setIntl = (initialIntl: Intl) => {
  if (initialIntl) {
    intl.lang = initialIntl.lang;
    intl.messages = initialIntl.messages;
  }
};

export const InjectIntl = ({ intl: globalIntl }) => {
  setIntl(globalIntl); // for SSR
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `var GLOBAL_INTL = ${JSON.stringify(globalIntl)};`,
      }}
    />
  );
};

if (isBrowser()) {
  setIntl((window as any).GLOBAL_INTL);
}

// We got rid of intl context for easier usage. See commit "Intl: remove intlContext"
// Only drawback is page refresh while changing language... we can live with that :-)
// In future consider https://github.com/vinissimus/next-translate

// TODO when switching locales in DEV mode, SSR still remembers old locale. Not a big issue.
