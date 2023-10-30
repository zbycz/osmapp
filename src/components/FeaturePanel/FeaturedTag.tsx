import React from 'react';
import styled from 'styled-components';

import WebsiteRenderer from './renderers/WebsiteRenderer';
import OpeningHoursRenderer from './renderers/OpeningHoursRenderer';
import PhoneRenderer from './renderers/PhoneRenderer';
import { EditIconButton } from './helpers/EditIconButton';
import { FoodHygieneRatingSchemeRenderer } from './renderers/FoodHygieneRatingScheme';
import { WikipediaRenderer } from './renderers/WikipediaRenderer';
import { WikidataRenderer } from './renderers/WikidataRenderer';

const Wrapper = styled.div`
  position: relative;
  padding-bottom: 15px;

  & .show-on-hover {
    display: none !important;
  }
  &:hover .show-on-hover {
    display: block !important;
  }
`;

const Value = styled.div`
  display: flex;
  font-size: 1rem;

  > svg {
    margin: 0 10px -6px 2px;
    opacity: 0.4;
  }

  :last-child {
    min-width: 0;
    overflow: hidden;
  }
`;

const DefaultRenderer = ({ v }) => v;
const renderers: {
  [key: string]: React.FC<{ k: string; v: string }>;
} = {
  website: WebsiteRenderer,
  'contact:website': WebsiteRenderer,
  phone: PhoneRenderer,
  'contact:phone': PhoneRenderer,
  'contact:mobile': PhoneRenderer,
  opening_hours: OpeningHoursRenderer,
  'fhrs:id': FoodHygieneRatingSchemeRenderer,
  wikipedia: WikipediaRenderer,
  wikidata: WikidataRenderer,
};

export const FeaturedTag = ({ k, v, onEdit }) => {
  const Renderer = renderers[k] || DefaultRenderer;

  return (
    <Wrapper>
      <EditIconButton onClick={() => onEdit(k)} />

      <Value>
        <Renderer k={k} v={v} />
      </Value>
    </Wrapper>
  );
};
