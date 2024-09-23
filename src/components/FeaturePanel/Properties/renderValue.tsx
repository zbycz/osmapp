import React from 'react';
import { getUrlForTag } from './getUrlForTag';
import { slashToOptionalBr } from '../../helpers';
import { DirectionValue } from './Direction';

const getEllipsisHumanUrl = (humanUrl) => {
  const MAX_LENGTH = 40;
  return humanUrl.replace(/^([^/]+.{0,5})(.*)$/, (full, hostname, rest) => {
    const charsLeft = MAX_LENGTH - 10 - hostname.length;
    return (
      hostname +
      (full.length > MAX_LENGTH
        ? `…${rest.substring(rest.length - charsLeft)}`
        : rest)
    );
  });
};

const getHumanValue = (k, v, featured: boolean) => {
  const humanValue = v.replace(/^https?:\/\//, '').replace(/^([^/]+)\/$/, '$1');

  if (v.startsWith('https://commons.wikimedia.org/wiki/')) {
    return v
      .substring('https://commons.wikimedia.org/wiki/'.length)
      .replace(/_/g, ' ');
  }
  if (k === 'image') {
    return getEllipsisHumanUrl(humanValue);
  }
  if (k.match(/:?wikipedia$/) && v.match(/:/)) {
    return v.split(':', 2)[1];
  }
  if (featured && k === 'wikidata') {
    return `Wikipedia (wikidata)`; // TODO fetch label from wikidata
  }
  if (v === 'yes') {
    return '✓';
  }
  if (v === 'no') {
    return '✗';
  }

  return humanValue;
};

export const renderValue = (k, v, featured = false) => {
  const url = getUrlForTag(k, v);
  const humanValue = getHumanValue(k, v, featured);

  if (k === 'direction') {
    return <DirectionValue v={v}>{humanValue}</DirectionValue>;
  }

  return url ? <a href={url}>{slashToOptionalBr(humanValue)}</a> : humanValue;
};
