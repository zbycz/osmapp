import React from 'react';
import styled from 'styled-components';

const MakiImg = styled.img`
  line-height: 14px;
  vertical-align: middle;
  margin-right: 6px;
  ${({ invert }) => invert && 'filter: invert(100%);'}
`;
const Maki = ({ ico, invert = false }) => (
  <MakiImg src={`/icons/${ico}_11.svg`} alt={ico} title={ico} invert={invert} />
);

export default Maki;
