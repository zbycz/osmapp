import React from 'react';
import { useUserThemeContext } from '../../../helpers/theme';
import styled from '@emotion/styled';
import { osmColorToHex, whiteOrBlackText } from '../helpers/color';

const getBgColor = (color: string | undefined, darkmode: boolean) => {
  if (color) return osmColorToHex(color);

  return darkmode ? '#898989' : '#dddddd';
};

const LineNumberWrapper = styled.a<{
  color: string | undefined;
  darkmode: boolean;
}>`
  background-color: ${({ color, darkmode }) => getBgColor(color, darkmode)};
  color: ${({ color, darkmode }) =>
    whiteOrBlackText(getBgColor(color, darkmode))};
  padding: 0.2rem 0.4rem;
  borderradius: 0.125rem;
  display: inline;
`;

interface LineNumberProps {
  name: string;
  color: string;
  osmType: string;
  osmId: string | number;
}

export const LineNumber: React.FC<LineNumberProps> = ({
  name,
  color,
  osmType,
  osmId,
}) => {
  const { currentTheme } = useUserThemeContext();
  const darkmode = currentTheme === 'dark';

  return (
    <LineNumberWrapper
      href={`/${osmType}/${osmId}`}
      color={color}
      darkmode={darkmode}
    >
      {name}
    </LineNumberWrapper>
  );
};
