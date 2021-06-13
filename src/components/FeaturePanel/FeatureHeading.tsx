import React from 'react';
import styled from 'styled-components';
import { EditIconButton } from './EditIconButton';

const Wrapper = styled.div`
  font-size: 36px;
  line-height: 0.98;
  color: rgba(0, 0, 0, 0.7);
  position: relative;
  padding-bottom: 30px;

  &:hover .show-on-hover {
    display: block !important;
  }
`;

const FeatureHeading = ({ title, onEdit }) => (
  <Wrapper>
    {onEdit && <EditIconButton onClick={() => onEdit('name')} />}
    {title}
  </Wrapper>
);

export default FeatureHeading;
