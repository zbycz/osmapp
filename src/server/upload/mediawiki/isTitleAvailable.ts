import fetch from 'isomorphic-unfetch';
import { getBody, WIKI_URL } from './utils';

export const isTitleAvailable = async (title: string) => {
  const response = await fetch(WIKI_URL, {
    method: 'POST',
    body: getBody({
      action: 'query',
      titles: title,
      format: 'json',
      formatversion: '2',
    }),
  });
  const data = await response.json();
  return data.query.pages[0].missing;
};
