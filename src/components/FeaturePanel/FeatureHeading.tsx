import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { EditIconButton } from './helpers/EditIconButton';
import { useFeatureContext } from '../utils/FeatureContext';
import { fetchJson } from '../../services/fetch';
import { intl } from '../../services/intl';
import { appendSearchParams, findFirstMatchingKey } from '../helpers';

const Wrapper = styled.div`
  font-size: 36px;
  line-height: 0.98;
  color: ${({ theme }) => theme.palette.text.panelHeading};
  position: relative;
  padding-bottom: 30px;
  ${({ deleted }) => deleted && 'text-decoration: line-through;'}

  &:hover .show-on-hover {
    display: block !important;
  }
`;

const IntlNameWrapper = styled.div`
  font-size: 22px;
  padding-top: 10px;
`;

export async function getWikiLabel(
  url: string,
  wikiid: string,
  language: string,
) {
  const response = await fetchJson(url);
  return response.entities?.[wikiid].labels[language]?.value;
}

export const FeatureHeading = ({ title, onEdit, deleted, editEnabled }) => {
  const [intlName, setAltName] = useState(null);
  const { feature } = useFeatureContext();
  const wikiKeys = ['wikidata', 'brand:wikidata'];
  const id = findFirstMatchingKey(feature.tags, wikiKeys);

  useEffect(() => {
    const apiUrl = appendSearchParams('https://www.wikidata.org/w/api.php', {
      format: 'json',
      origin: '*',
      action: 'wbgetentities',
      props: 'labels',
      ids: id,
    });

    const fetchData = async (url: string, wikiid: string, language: string) => {
      const wikiName = await getWikiLabel(url, wikiid, language);
      setAltName(wikiName);
    };

    fetchData(apiUrl, id, intl.lang);
  }, [id]);

  return (
    <Wrapper deleted={deleted}>
      <div>
        {editEnabled && <EditIconButton onClick={() => onEdit('name')} />}
        {title}
      </div>
      {intlName && intlName !== title ? (
        <IntlNameWrapper>{intlName}</IntlNameWrapper>
      ) : (
        <></>
      )}
    </Wrapper>
  );
};
