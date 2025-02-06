import React from 'react';
import styled from '@emotion/styled';
import { WebsiteRenderer } from './renderers/WebsiteRenderer';
import { OpeningHoursRenderer } from './renderers/OpeningHoursRenderer';
import { PhoneRenderer } from './renderers/PhoneRenderer';
import { InlineEditButton } from './helpers/InlineEditButton';
import { FoodHygieneRatingSchemeRenderer } from './renderers/FoodHygieneRatingScheme';
import { WikipediaRenderer } from './renderers/WikipediaRenderer';
import { WikidataRenderer } from './renderers/WikidataRenderer';
import { isDesktopResolution } from '../helpers';
import { ClimbingGradeRenderer } from './renderers/ClimbingGradeRenderer';
import { nl2br } from '../utils/nl2br';
import { FeaturedKeyRenderer } from '../../services/tagging/featuredKeys';
import { useFeatureContext } from '../utils/FeatureContext';

const Wrapper = styled.div`
  position: relative;
  padding-bottom: 15px;

  & .show-on-hover {
    display: none !important;
  }

  @media ${isDesktopResolution} {
    &:hover .show-on-hover {
      display: flex !important;
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

const DefaultRenderer = ({ v }) => <>{nl2br(v)}</>;

type RendererComponents = {
  [key in FeaturedKeyRenderer]: React.FC<{ k: string; v: string }>;
};

const components: RendererComponents = {
  WebsiteRenderer: WebsiteRenderer,
  PhoneRenderer: PhoneRenderer,
  OpeningHoursRenderer: OpeningHoursRenderer,
  FoodHygieneRatingSchemeRenderer: FoodHygieneRatingSchemeRenderer,
  WikipediaRenderer: WikipediaRenderer,
  WikidataRenderer: WikidataRenderer,
  ClimbingGradeRenderer: ClimbingGradeRenderer,
  DescriptionRenderer: DefaultRenderer,
  NullRenderer: null,
};

type Props = {
  k: string;
  renderer: FeaturedKeyRenderer;
};

export const FeaturedTag = ({ k, renderer }: Props) => {
  const { feature } = useFeatureContext();
  const value = feature.tags[k];

  const Renderer = components[renderer];
  if (!Renderer || !value) {
    return null;
  }

  return (
    <Wrapper>
      <InlineEditButton k={k} />

      <Value>
        <Renderer k={k} v={value} />
      </Value>
    </Wrapper>
  );
};
