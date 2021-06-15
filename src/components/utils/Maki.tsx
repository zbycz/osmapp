import React from 'react';
import styled from 'styled-components';
import { icons } from '../../assets/icons';

const MakiImg = styled.img`
  line-height: 14px;
  vertical-align: middle;
  margin-right: 6px;
  ${({ invert }) => invert && 'filter: invert(100%);'}
`;
const Maki = ({
  ico,
  invert = false,
  title = undefined,
  style = undefined,
}) => {
  const icon = icons.includes(ico) ? ico : 'information';
  return (
    <MakiImg
      src={`/icons/${icon}_11.svg`}
      alt={ico}
      title={title ?? ico}
      invert={invert}
      style={style}
    />
  );
};

export default Maki;
