import React from 'react';
import styled from 'styled-components';

import WebsiteRenderer from './renderers/WebsiteRenderer';
import OpeningHoursRenderer from './renderers/OpeningHoursRenderer';
import PhoneRenderer from './renderers/PhoneRenderer';
import { EditIconButton } from './helpers/EditIconButton';

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
`;

const DefaultRenderer = ({ v }) => v;
const renderers = {
  website: WebsiteRenderer,
  'contact:website': WebsiteRenderer,
  phone: PhoneRenderer,
  'contact:phone': PhoneRenderer,
  'contact:mobile': PhoneRenderer,
  opening_hours: OpeningHoursRenderer,
};

export const FeaturedTag = ({ k, v, onEdit }) => {
  const Renderer = renderers[k] || DefaultRenderer;

  return (
    <Wrapper>
      <EditIconButton onClick={() => onEdit(k)} />

      <Value>
        <Renderer v={v} />
      </Value>
    </Wrapper>
  );
};
