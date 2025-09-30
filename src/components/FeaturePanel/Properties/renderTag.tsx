import React, { Fragment } from 'react';
import { getUrlForTag } from './getUrlForTag';
import { slashToOptionalBr } from '../../helpers';
import { DirectionValue } from './Direction';
import { osmColorToHex, whiteOrBlackText } from '../helpers/color';
import styled from '@emotion/styled';
import { humanInterval } from './interval';
import { useQuery } from 'react-query';
import { encodeUrl } from '../../../helpers/utils';
import { fetchJson } from '../../../services/fetch';
import { intl } from '../../../services/intl';

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

export const getHumanValue = (k: string, v: string) => {
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
  if (k === 'interval') {
    try {
      return humanInterval(v);
    } catch {
      return v;
    }
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

type WikidataResponse = {
  entities: Record<string, { labels: Record<string, { value: string }> }>;
};

const WikidataValue = ({ v }: { v: string }) => {
  const { data } = useQuery([v], async () => {
    const url = encodeUrl`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${v}&format=json&props=labels&origin=*`;
    const response = await fetchJson<WikidataResponse>(url);
    const { labels } = response.entities[v];
    return (
      labels[intl.lang].value ||
      labels.en.value ||
      Object.values(labels)[0].value ||
      v
    );
  });

  return <>{data || v} (Wikidata)</>;
};

const SpecialRenderer = ({
  k,
  v,
  humanValue,
}: {
  k: string;
  v: string;
  humanValue: string;
}) => {
  if (k === 'direction') {
    return <DirectionValue v={v}>{humanValue}</DirectionValue>;
  }
  if (/colour/.test(k)) {
    return <ColorValue v={v}>{humanValue}</ColorValue>;
  }
  if (/wikidata/.test(k)) {
    return <WikidataValue v={v} />;
  }

  return null;
};

const renderTagSingleValue = (k: string, v: string) => {
  const humanValue = getHumanValue(k, v);

  const special = SpecialRenderer({ k, v, humanValue });
  const url = getUrlForTag(k, v);
  return url ? (
    <a href={url} target="_blank">
      {special || slashToOptionalBr(humanValue)}
    </a>
  ) : (
    special || humanValue
  );
};

export const renderTag = (k: string, v: string) => {
  return v.split(';').map((v, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={idx}>
      {idx > 0 && '; '}
      {renderTagSingleValue(k, v)}
    </Fragment>
  ));
};
