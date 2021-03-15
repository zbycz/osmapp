
import * as React from 'react';
import styled from 'styled-components';

const MakiImg = styled.img`
  line-height: 14px;
  vertical-align: middle;
  margin-right: 6px;
  filter: invert(100%);
  width: 11px;
  height: 11px;
`;
const Maki = ({ ico }) => (
  <MakiImg src={`/maki/${ico}-11.svg`} alt={ico} title={ico} />
);

export default Maki;
