import React from 'react';
import styled from 'styled-components';

import WebsiteRenderer from './renderers/WebsiteRenderer';
import OpeningHoursRenderer from './renderers/OpeningHoursRenderer';
import PhoneRenderer from './renderers/PhoneRenderer';
import { EditIconButton } from './EditIconButton';

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
  color: rgba(0, 0, 0, 0.87);

  i {
    color: rgba(0, 0, 0, 0.54);
  }

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

const Property = ({ k, v, onEdit }) => {
  const Renderer = renderers[k] || DefaultRenderer;

  return (
    <Wrapper>
      <EditIconButton onClick={() => onEdit(k)} />

      <Value>{v ? <Renderer v={v} /> : <i>-</i>}</Value>
    </Wrapper>
  );
};

export default Property;
