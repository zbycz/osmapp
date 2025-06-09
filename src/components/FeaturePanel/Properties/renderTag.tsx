import React, { Fragment } from 'react';
import { getUrlForTag } from './getUrlForTag';
import { slashToOptionalBr } from '../../helpers';
import { DirectionValue } from './Direction';
import { osmColorToHex, whiteOrBlackText } from '../helpers/color';
import styled from '@emotion/styled';

const getEllipsisHumanUrl = (humanUrl: string) => {
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

const getHumanValue = (k: string, v: string, featured: boolean) => {
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

const ColorValue = styled.div<{ v: string }>`
  background-color: ${({ v }) => osmColorToHex(v)};
  color: ${({ v }) => whiteOrBlackText(osmColorToHex(v))};
  padding: 0.2rem 0.4rem;
  border-radius: 0.125rem;
  display: inline;
`;

const renderTagSingleValue = (k: string, v: string, featured = false) => {
  const humanValue = getHumanValue(k, v, featured);

  if (k === 'direction') {
    return <DirectionValue v={v}>{humanValue}</DirectionValue>;
  }
  if (k === 'colour') {
    return <ColorValue v={v}>{humanValue}</ColorValue>;
  }

  const url = getUrlForTag(k, v);
  return url ? (
    <a href={url} target="_blank">
      {slashToOptionalBr(humanValue)}
    </a>
  ) : (
    humanValue
  );
};

export const renderTag = (k: string, v: string, featured = false) => {
  return v.split(';').map((v, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={idx}>
      {idx > 0 && (featured ? ', ' : '; ')}
      {renderTagSingleValue(k, v, featured)}
    </Fragment>
  ));
};
