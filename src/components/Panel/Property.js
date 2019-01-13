// @flow

import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 15px;
`;

const Label = styled.div`
  font-family: Roboto;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.54);
`;

const Value = styled.div`
  font-family: Roboto;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.87);
`;

export const Property = ({ label, value }) => (
  <Wrapper>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Wrapper>
);

export default Property;
