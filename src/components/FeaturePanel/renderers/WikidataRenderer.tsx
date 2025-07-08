import React from 'react';
import { WikipediaIcon } from '../../../assets/WikipediaIcon';
import { useQuery } from 'react-query';
import { fetchJson } from '../../../services/fetch';
import { getUrlForTag } from '../Properties/getUrlForTag';
import { intl } from '../../../services/intl';
import { encodeUrl } from '../../../helpers/utils';

type WikidataResponse = {
  entities: Record<
    string,
    {
      labels: Record<string, { value: string }>;
    }
  >;
};

export const WikidataRenderer = ({ k, v }: { k: string; v: string }) => {
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

  return (
    <>
      <WikipediaIcon width={20} height={20} />
      <a href={getUrlForTag(k, v)}>{data || v} (Wikidata)</a>
    </>
  );
};
