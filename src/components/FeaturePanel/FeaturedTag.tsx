import React from 'react';
import styled from '@emotion/styled';

import WebsiteRenderer from './renderers/WebsiteRenderer';
import OpeningHoursRenderer from './renderers/OpeningHoursRenderer';
import PhoneRenderer from './renderers/PhoneRenderer';
import { InlineEditButton } from './helpers/InlineEditButton';
import { FoodHygieneRatingSchemeRenderer } from './renderers/FoodHygieneRatingScheme';
import { WikipediaRenderer } from './renderers/WikipediaRenderer';
import { WikidataRenderer } from './renderers/WikidataRenderer';
import { isDesktopResolution } from '../helpers';
import { ClimbingRenderer } from './renderers/ClimbingRenderer';
import { gradeSystemKeys } from './Climbing/utils/grades/gradeSystem';

const Wrapper = styled.div`
  position: relative;
  padding-bottom: 15px;

  & .show-on-hover {
    display: none !important;
  }

  @media ${isDesktopResolution} {
    &:hover .show-on-hover {
      display: block !important;
    }
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

type Renderers = {
  [key: string]: React.FC<{ k: string; v: string }>;
};

const DefaultRenderer = ({ v }) => v;

const climbingRenderers = gradeSystemKeys.reduce(
  (acc, gradeSystemKey) => ({
    ...acc,
    [gradeSystemKey]: ClimbingRenderer,
  }),
  {},
);

const renderers: Renderers = {
  // also update in schema – getFeaturedTags()
  website: WebsiteRenderer,
  'website:2': WebsiteRenderer,
  'contact:website': WebsiteRenderer,
  url: WebsiteRenderer,
  phone: PhoneRenderer,
  'contact:phone': PhoneRenderer,
  'contact:mobile': PhoneRenderer,
  opening_hours: OpeningHoursRenderer,
  'fhrs:id': FoodHygieneRatingSchemeRenderer,
  wikipedia: WikipediaRenderer,
  wikidata: WikidataRenderer,
  ...climbingRenderers,
};

export const FeaturedTag = ({ k, v }) => {
  const Renderer = renderers[k] || DefaultRenderer;

  return (
    <Wrapper>
      <InlineEditButton k={k} />

      <Value>
        <Renderer k={k} v={v} />
      </Value>
    </Wrapper>
  );
};
