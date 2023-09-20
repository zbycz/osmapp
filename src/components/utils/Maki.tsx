import React from 'react';
import styled from 'styled-components';
import { icons } from '../../assets/icons';

const MakiImg = styled.img`
  line-height: 14px;
  margin-right: 6px;
  ${({ invert }) => invert && 'filter: invert(100%);'}
`;
const Maki = ({
  ico,
  invert = false,
  title = undefined,
  style = undefined,
  size = 11,
  middle = undefined,
}) => {
  const icon = icons.includes(ico) ? ico : 'information';
  // console.log(icon, ' was: ',ico)
  return (
    <MakiImg
      src={`/icons/${icon}_11.svg`}
      alt={ico}
      title={title ?? ico}
      invert={invert}
      style={{ ...style, verticalAlign: middle ? 'middle' : undefined }}
      width={size}
      height={size}
    />
  );
};

export default Maki;
